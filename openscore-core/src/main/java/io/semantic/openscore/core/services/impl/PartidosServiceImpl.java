package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.api.partidos.ResultadoDTO;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.model.*;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.services.api.PartidosService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.util.List;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class PartidosServiceImpl implements PartidosService {


    private PartidoRepository partidoRepository;
    private EquiposRepository equiposRepository;
    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;
    private PartidoMapper partidoMapper;

    public PartidosServiceImpl() {
    }

    @Inject
    public PartidosServiceImpl(final PartidoRepository partidoRepository,
                               final EquiposRepository equiposRepository,
                               final GrupoRepository grupoRepository,
                               final FaseRepository faseRepository,
                               final PartidoMapper partidoMapper) {
        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
        this.partidoMapper = partidoMapper;
    }

    @Override
    public ApiResponse<List<PartidoDTO>> getAll(int page,
                                                int pageSize,
                                                String grupo,
                                                String fase,
                                                long dia,
                                                String equipo) {

        this.partidoRepository.findAll();
        List<Partido> partidos = this.partidoRepository.findAll();
        return ok(this.partidoMapper.asApi(partidos));
    }


    @Override
    public ApiResponse<PartidoDTO> get(long id) {
        Partido partido = getPartido(id);
        return ok(this.partidoMapper.asApi(partido));
    }

    @Override
    public ApiResponse<List<Integer>> getFechas() {
        return ok(this.partidoRepository.findAllFechas());
    }

    @Override
    @Secure(Rol.ADMIN)
    public ApiResponse<Long> delete(long id) {
        return null;
    }

    @Override
    @Secure(Rol.ADMIN)
    public ApiResponse<PartidoDTO> add(CrearOUpdatePartidoDTO entity) {
        Partido partido = crearPartido(0, entity);
        this.partidoRepository.save(partido);
        return ok(this.partidoMapper.asApi(partido));
    }

    private Partido crearPartido(long id, CrearOUpdatePartidoDTO entity) {
        Partido partido = new Partido();
        if (id > 0) {
            partido = this.getPartido(id);
        }
        Equipo local = this.getEquipo(entity.getLocal());
        Equipo visitante = this.getEquipo(entity.getVisitante());
        partido.setLocal(local);
        partido.setVisitante(visitante);
        partido.setFecha(entity.getFecha());
        partido.setGrupo(this.getGrupo(entity.getGrupo()));
        partido.setFase(this.getFase(entity.getFase()));
        partido.setLugar(entity.getLugar());
        partido.setDia(entity.getDia());
        return partido;
    }

    private Equipo getEquipo(String codigo) {
        return this.equiposRepository.findByCodigo(codigo).orElseThrow(() ->
                new IllegalArgumentException(MessageFormat.format("Equipo con codigo [{0}] no encontrado", codigo)));
    }

    private Grupo getGrupo(String codigo) {
        return this.grupoRepository.findByCodigo(codigo).orElseThrow(() ->
                new IllegalArgumentException(MessageFormat.format("Grupo con codigo [{0}] no encontrado", codigo)));
    }

    private Fase getFase(String codigo) {
        return this.faseRepository.findByCodigo(codigo).orElseThrow(() ->
                new IllegalArgumentException(MessageFormat.format("Fase con codigo [{0}] no encontrado", codigo)));
    }

    @Override
    @Secure(Rol.ADMIN)
    public ApiResponse<PartidoDTO> update(long id, CrearOUpdatePartidoDTO entity) {
        Partido partido = crearPartido(id, entity);
        this.partidoRepository.save(partido);
        return ok(this.partidoMapper.asApi(partido));
    }

    @Override
    @Secure(Rol.ADMIN)
    public ApiResponse<PartidoDTO> setResultado(long partidoId, ResultadoDTO resultado) {
        Partido partido = this.getPartido(partidoId);
        partido.setResultado(this.partidoMapper.asResultado(resultado));
        this.partidoRepository.save(partido);
        return ok(this.partidoMapper.asApi(partido));

    }

    private Partido getPartido(long partidoId) {
        return this.partidoRepository
                .findById(partidoId)
                .orElseThrow(() ->
                        new IllegalArgumentException(MessageFormat
                                .format("El partido <{0}> no fue encontrado", partidoId)));
    }
}
