package io.semantic.openscore.core.repository.startup.steps;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.startup.builder.DiaBuilder;
import io.semantic.openscore.core.repository.startup.PartidoData;
import io.semantic.openscore.core.repository.startup.StartupStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CrearPartidos implements StartupStep {

    private Logger logger = LoggerFactory.getLogger(CrearPartidos.class);

    private PartidoRepository partidoRepository;
    private EquiposRepository equiposRepository;
    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;
    private DiaBuilder diaBuilder;


    public CrearPartidos() {
    }

    @Inject
    public CrearPartidos(PartidoRepository partidoRepository,
                         EquiposRepository equiposRepository,
                         GrupoRepository grupoRepository,
                         FaseRepository faseRepository,
                         DiaBuilder diaBuilder) {

        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
        this.diaBuilder = diaBuilder;
    }

    @Override
    public void run() {
        List<PartidoData> partidos = this.loadPartidosData("data/partidos.json");

        partidos.forEach(partido -> {
            this.crearPartidoSiNoExiste(partido.getLocal(),
                    partido.getVisitante(),
                    getGrupo(partido.getGrupo()),
                    getFase(partido.getFase()),
                    diaBuilder.getMatchDate(partido.getDia()),
                    Integer.parseInt(partido.getFecha()),
                    partido.getLugar());
        });


    }

    private List<PartidoData> loadPartidosData(String location) {
        try {
            Gson gson = new Gson();
            InputStreamReader reader = new InputStreamReader(CrearPartidos.class.getClassLoader().getResourceAsStream(location), "UTF-8");
            Type listType = new TypeToken<ArrayList<PartidoData>>() {
            }.getType();
            List<PartidoData> partidos = gson.fromJson(reader, listType);
            return partidos;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    private void crearPartidoSiNoExiste(String codigoLocal,
                                        String codigoVisitante,
                                        Grupo grupo,
                                        Fase fase,
                                        Date dia,
                                        int fecha,
                                        String lugar) {

        if (!this.partidoRepository.exist(codigoLocal, codigoVisitante, grupo, fase)) {
            Equipo local = getEquipo(codigoLocal);
            Equipo visitante = getEquipo(codigoVisitante);
            Partido partido = new Partido();
            partido.setLocal(local);
            partido.setVisitante(visitante);
            partido.setDia(dia);
            partido.setLugar(lugar);
            partido.setGrupo(grupo);
            partido.setFecha(fecha);
            partido.setFase(fase);

            this.partidoRepository.save(partido);
        }
    }

    private Equipo getEquipo(String codigoLocal) {
        return this.equiposRepository.findByCodigo(codigoLocal).orElseThrow(() -> new IllegalArgumentException("El equipo " + codigoLocal + "no existe"));
    }


    private Grupo getGrupo(String codigo) {
        logger.info(codigo);
        return this.grupoRepository.findByCodigo(codigo).orElseThrow(() -> new IllegalArgumentException("El grupo " + codigo + "no existe"));
    }

    private Fase getFase(String codigo) {
        return this.faseRepository.findByCodigo(codigo);
    }


    @Override
    public int priority() {
        return 2000;
    }
}
