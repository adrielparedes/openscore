package io.semantic.openscore.core.services.impl;

import static io.semantic.openscore.core.services.RestUtil.ok;

import java.text.MessageFormat;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.api.partidos.ResultadoDTO;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.startup.builder.DiaBuilder;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.services.api.PartidosService;
import io.semantic.openscore.core.services.api.StandingsService;

@ApplicationScoped
public class PartidosServiceImpl implements PartidosService {

    private PartidoRepository partidoRepository;
    private EquiposRepository equiposRepository;
    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;
    private PartidoMapper partidoMapper;
    private DiaBuilder diaBuilder;
    private StandingsService standingsService;

    public PartidosServiceImpl() {
    }

    @Inject
    public PartidosServiceImpl(final PartidoRepository partidoRepository,
            final EquiposRepository equiposRepository,
            final GrupoRepository grupoRepository,
            final FaseRepository faseRepository,
            final PartidoMapper partidoMapper,
            final StandingsService standingService,
            final DiaBuilder diaBuilder) {
        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
        this.partidoMapper = partidoMapper;
        this.standingsService = standingService;
        this.diaBuilder = diaBuilder;
    }

    @Override
    public ApiResponse<List<PartidoDTO>> getAll(int page,
            int pageSize,
            String grupo,
            String fase,
            long dia,
            String equipo) {

        List<Partido> partidos = this.partidoRepository.findAll(new Page(page, pageSize));
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
        this.partidoRepository.hardDeleteById(id);
        return ok(1l);
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
        partido.setDia(diaBuilder.epochToDate(entity.getDia()));
        return partido;
    }

    private Equipo getEquipo(String codigo) {
        return this.equiposRepository.findByCodigo(codigo).orElseThrow(() -> new IllegalArgumentException(
                MessageFormat.format("Equipo con codigo [{0}] no encontrado", codigo)));
    }

    private Grupo getGrupo(String codigo) {
        return this.grupoRepository.findByCodigo(codigo).orElseThrow(() -> new IllegalArgumentException(
                MessageFormat.format("Grupo con codigo [{0}] no encontrado", codigo)));
    }

    private Fase getFase(String codigo) {
        return this.faseRepository.findByCodigo(codigo).orElseThrow(() -> new IllegalArgumentException(
                MessageFormat.format("Fase con codigo [{0}] no encontrado", codigo)));
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
        this.standingsService.calculate();
        return ok(this.partidoMapper.asApi(partido));

    }

    private Partido getPartido(long partidoId) {
        return this.partidoRepository
                .findById(partidoId)
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat
                        .format("El partido <{0}> no fue encontrado", partidoId)));
    }

    @Override
    public ApiResponse<Long> count() {
        return ok(this.partidoRepository.count());
    }
}
