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
import io.semantic.openscore.core.repository.startup.PartidoData;
import io.semantic.openscore.core.repository.startup.StartupStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class CrearPartidos implements StartupStep {

    private Logger logger = LoggerFactory.getLogger(CrearPartidos.class);


    public static final String DATE_PATTERN = "dd-MM-yyyy'T'HH:mmZ";
    private PartidoRepository partidoRepository;
    private EquiposRepository equiposRepository;
    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;


    public CrearPartidos() {
    }

    @Inject
    public CrearPartidos(PartidoRepository partidoRepository,
                         EquiposRepository equiposRepository,
                         GrupoRepository grupoRepository,
                         FaseRepository faseRepository) {

        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
    }

    @Override
    public void run() {
        List<PartidoData> partidos = this.loadPartidosData("data/partidos.json");

        partidos.forEach(partido -> {
            this.crearPartidoSiNoExiste(partido.getLocal(),
                    partido.getVisitante(),
                    getGrupo(partido.getGrupo()),
                    getFase(partido.getFase()),
                    getMatchDate(partido.getDia()),
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
            partido.setFase(fase);

            this.partidoRepository.save(partido);
        }
    }

    private Equipo getEquipo(String codigoLocal) {
        return this.equiposRepository.findByCodigo(codigoLocal).orElseThrow(() -> new IllegalArgumentException("El equipo " + codigoLocal + "no existe"));
    }

    protected Date getMatchDate(String fecha) {

        try {
            return new SimpleDateFormat(DATE_PATTERN).parse(fecha);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

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
