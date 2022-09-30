package io.semantic.openscore.core.repository.startup.steps;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.type.TypeReference;

import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.startup.PartidoData;
import io.semantic.openscore.core.repository.startup.builder.DiaBuilder;

@ApplicationScoped
public class CrearPartidos extends FileBasedStartupStep<PartidoData, Partido> {

    private Logger logger = LoggerFactory.getLogger(CrearPartidos.class);

    private EquiposRepository equiposRepository;
    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;
    private DiaBuilder diaBuilder;

    public CrearPartidos() {
        super(Partido.class, null, new TypeReference<List<PartidoData>>() {
        });
    }

    @Inject
    public CrearPartidos(PartidoRepository partidoRepository,
            EquiposRepository equiposRepository,
            GrupoRepository grupoRepository,
            FaseRepository faseRepository,
            DiaBuilder diaBuilder) {

        super(Partido.class, partidoRepository, new TypeReference<List<PartidoData>>() {
        });
        this.equiposRepository = equiposRepository;
        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
        this.diaBuilder = diaBuilder;
    }

    @Override
    public String getFileName() {
        return "data/partidos.yml";
    }

    @Override
    protected Partido map(PartidoData partidoData) {

        Equipo local = getEquipo(partidoData.getLocal());
        Equipo visitante = getEquipo(partidoData.getVisitante());
        Partido partido = new Partido();
        partido.setLocal(local);
        partido.setVisitante(visitante);
        partido.setDia(diaBuilder.getMatchDate(partidoData.getDia()));
        partido.setLugar(partidoData.getLugar());
        partido.setGrupo(getGrupo(partidoData.getGrupo()));
        partido.setFecha(partido.getFecha());
        partido.setFase(getFase(partidoData.getFase()));
        return partido;

    }

    private Equipo getEquipo(String codigoLocal) {
        return this.equiposRepository.findByCodigo(codigoLocal)
                .orElseThrow(() -> new IllegalArgumentException("El equipo " + codigoLocal + "no existe"));
    }

    private Grupo getGrupo(String codigo) {
        logger.info(codigo);
        return this.grupoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("El grupo " + codigo + "no existe"));
    }

    private Fase getFase(String codigo) {
        return this.faseRepository.findByCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("La fase " + codigo + "no existe"));

    }

    @Override
    public int priority() {
        return 2000;
    }
}
