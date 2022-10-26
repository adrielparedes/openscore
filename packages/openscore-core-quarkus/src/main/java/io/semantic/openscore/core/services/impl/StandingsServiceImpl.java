package io.semantic.openscore.core.services.impl;

import static io.semantic.openscore.core.services.RestUtil.ok;

import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Ganador;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.PartidoStatus;
import io.semantic.openscore.core.model.Standing;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.StandingsRepository;
import io.semantic.openscore.core.services.api.StandingsService;

@ApplicationScoped
public class StandingsServiceImpl implements StandingsService {

    private EquiposRepository equiposRepository;
    private PartidoRepository partidoRepository;
    private StandingsRepository standingsRepository;

    @Inject
    public StandingsServiceImpl(final EquiposRepository equiposRepository, final PartidoRepository partidoRepository,
            final StandingsRepository standingsRepository) {
        this.equiposRepository = equiposRepository;
        this.partidoRepository = partidoRepository;
        this.standingsRepository = standingsRepository;

    }

    @Override
    public ApiResponse<List<Standing>> getAll(int page, int pageSize, String filter) {
        if (filter != null && !filter.isEmpty()) {
            return ok(standingsRepository.findByGrupo(filter));
        } else {
            return ok(standingsRepository.findAll());
        }
    }

    @Override
    public ApiResponse<String> calculate() {

        standingsRepository.deleteAll();

        List<Equipo> equipos = equiposRepository.findAll();
        List<Partido> partidos = partidoRepository.findAllByFase(Fase.GRUPO);

        for (Equipo equipo : equipos) {
            List<Partido> partidosEquipo = partidos.stream().filter(partido -> partido.getLocal().getCodigo()
                    .equals(equipo.getCodigo()) || partido.getVisitante().getCodigo().equals(equipo.getCodigo()))
                    .collect(Collectors.toList());

            int ganado = 0;
            int perdido = 0;
            int empatado = 0;
            int diferenciaGol = 0;
            Grupo grupo = null;

            for (Partido partido : partidosEquipo) {

                grupo = partido.getGrupo();

                if (partido.getStatus().equals(PartidoStatus.FINISHED)) {

                    Ganador ganador = partido.getResultado().getGanador();

                    if (ganador.equals(Ganador.LOCAL) &&
                            partido.getLocal().getCodigo().equals(equipo.getCodigo())) {
                        ganado++;
                        diferenciaGol += partido.getResultado().getLocal() - partido.getResultado().getVisitante();

                    } else if (ganador.equals(Ganador.VISITANTE)
                            && partido.getVisitante().getCodigo().equals(equipo.getCodigo())) {
                        ganado++;
                        diferenciaGol += partido.getResultado().getVisitante() - partido.getResultado().getLocal();
                    } else if (ganador.equals(Ganador.EMPATE)) {
                        empatado++;
                    } else {
                        perdido++;
                    }

                }

            }

            Standing standing = new Standing();
            standing.setEquipo(equipo);
            standing.setGrupo(grupo);
            standing.setGanados(ganado);
            standing.setEmpatados(empatado);
            standing.setPerdidos(perdido);
            standing.setDiferenciaGol(diferenciaGol);
            standing.setPuntos(calculatePoints(ganado, empatado, perdido));
            standingsRepository.save(standing);
        }

        return ok("Complete");

    }

    private int calculatePoints(int ganado, int empatado, int perdido) {
        return 0;
    }

}
