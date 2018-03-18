package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionDTO;
import io.semantic.openscore.core.api.competiciones.DefinicionCompeticionDTO;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.exceptions.EntityNotFoundException;
import io.semantic.openscore.core.mapping.DefinicionCompeticionMapper;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.services.api.DefinicionCompeticionesService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.QueryParam;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class DefinicionCompeticionServiceImpl implements DefinicionCompeticionesService {

    private PartidoRepository partidoRepository;
    private EquiposRepository equiposRepository;
    private PartidoMapper partidoMapper;
    private DefinicionCompeticionMapper definicionCompeticionMapper;
    private CompeticionesRepository competicionesRepository;

    public DefinicionCompeticionServiceImpl() {
    }

    @Inject
    public DefinicionCompeticionServiceImpl(CompeticionesRepository competicionesRepository,
                                            PartidoRepository partidoRepository,
                                            EquiposRepository equiposRepository,
                                            PartidoMapper partidoMapper,
                                            DefinicionCompeticionMapper definicionCompeticionMapper) {
        this.competicionesRepository = competicionesRepository;
        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
        this.partidoMapper = partidoMapper;
        this.definicionCompeticionMapper = definicionCompeticionMapper;
    }

    @Override
    public ApiResponse<List<DefinicionCompeticionDTO>> getAll(@QueryParam("page") int page,
                                                              @QueryParam("pageSize") int pageSize) {
        return ok(this.competicionesRepository.findAll(new Page(page,
                pageSize)).stream().map(competicion -> map(competicion))
                .collect(Collectors.toList()));
    }

    @Override
    public ApiResponse<DefinicionCompeticionDTO> get(long id) {
        Optional<DefinicionCompeticion> found = this.competicionesRepository.findByIdWithDeleted(id);
        return ok(map(found.orElseThrow(() ->
                new EntityNotFoundException(MessageFormat.format("La competicion con el id <{0}> no fue encontrada",
                        id)))));
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        this.competicionesRepository.deleteById(id);
        return ok(id);
    }

    @Override
    public ApiResponse<DefinicionCompeticionDTO> add(CrearDefinicionCompeticionDTO crearCrearDefinicionCompeticionDTO) {

        DefinicionCompeticion definicionCompeticion = definicionCompeticionMapper.asDefinicion(crearCrearDefinicionCompeticionDTO);
        this.competicionesRepository.save(definicionCompeticion);
        return ok(map(definicionCompeticion));
    }

    @Override
    public ApiResponse<DefinicionCompeticionDTO> update(long id, CrearDefinicionCompeticionDTO competicionApi) {

        Optional<DefinicionCompeticion> definicionCompeticion = this.competicionesRepository.findByIdWithDeleted(id);

        DefinicionCompeticion competicion = definicionCompeticion
                .orElseThrow(() -> new IllegalArgumentException("Error al intentar hacer update de la competicion: " + id));

        competicion.setNombre(competicionApi.getNombre());
        competicion.setLogo(competicionApi.getLogo());
        competicion.setDescripcion(competicionApi.getDescripcion());
        this.competicionesRepository.save(competicion);

        return ok(map(competicion));
    }

    private DefinicionCompeticionDTO map(DefinicionCompeticion competicion) {
        return this.definicionCompeticionMapper.asApi(competicion);
    }

    @Override
    public ApiResponse<List<PartidoDTO>> getPartidos(long id) {
        Set<Partido> partidos = this.getPartidosByDefinicionCompeticion(id);
        List<PartidoDTO> api = partidos.stream()
                .map(partido -> this.partidoMapper.asApi(partido))
                .collect(Collectors.toList());
        return ok(api);
    }

    @Override
    public ApiResponse<PartidoDTO> getPartido(long id, long idPartido) {
        Set<Partido> partidos = getPartidosByDefinicionCompeticion(id);
        Optional<Partido> partido = partidos.stream().filter(p -> p.getId() == idPartido).findAny();
        return partido
                .map(p -> ok(this.partidoMapper.asApi(p)))
                .orElseThrow(() -> new IllegalArgumentException("El partido buscado no fue encontrado"));
    }

    @Override
    public ApiResponse<PartidoDTO> addPartido(long id, CrearOUpdatePartidoDTO crearPartido) {
        DefinicionCompeticion competicion = this.competicionesRepository.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Competicion no encontrada"));
        Partido partido = this.partidoMapper.asPartido(crearPartido);
        this.partidoRepository.save(partido);
        competicion.addPartido(partido);
        this.competicionesRepository.save(competicion);
        return ok(this.partidoMapper.asApi(partido));
    }

    @Override
    public ApiResponse<PartidoDTO> updatePartido(long id, long idPartido, CrearOUpdatePartidoDTO crearOUpdatePartidoDTO) {
        Partido partido = findPartido(id, idPartido);


        Equipo local = findEquipo(crearOUpdatePartidoDTO.getIdLocal(), "Equipo Local no encontrado");
        Equipo visitante = findEquipo(crearOUpdatePartidoDTO.getIdLocal(), "Equipo Visitante no encontrado");


        partido.setFecha(crearOUpdatePartidoDTO.getFecha());
        partido.setLugar(crearOUpdatePartidoDTO.getLugar());
        partido.setLocal(local);
        partido.setVisitante(visitante);

        this.partidoRepository.save(partido);

        return ok(this.partidoMapper.asApi(partido));
    }

    private Partido findPartido(long id, long idPartido) {
        Set<Partido> partidos = this.getPartidosByDefinicionCompeticion(id);
        return partidos
                .stream()
                .filter(p -> p.getId() == idPartido)
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));
    }

    private Equipo findEquipo(long id, String error) {
        return this.equiposRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException(error));
    }

    @Override
    public ApiResponse<PartidoDTO> deletePartido(long id, long idPartido) {
        this.partidoRepository.deleteById(idPartido);
        Partido partido = this.partidoRepository.findById(idPartido)
                .orElseThrow(() -> new IllegalArgumentException("Partido no encontrado"));
        return ok(this.partidoMapper.asApi(partido));
    }

    private Set<Partido> getPartidosByDefinicionCompeticion(long id) {
        DefinicionCompeticion competicion = this.competicionesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Definicion competicion no encontrada"));
        return competicion.getPartidos();
    }
}
