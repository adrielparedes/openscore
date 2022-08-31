package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.ranking.Ranking;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.api.RankingService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import java.text.MessageFormat;
import java.util.Comparator;
import java.util.List;
import java.util.stream.IntStream;

import static io.semantic.openscore.core.services.RestUtil.ok;
import static java.util.stream.Collectors.toList;

@RequestScoped
public class RankingServiceImpl implements RankingService {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;

    public RankingServiceImpl() {
    }

    @Inject
    public RankingServiceImpl(UsuarioRepository usuarioRepository,
                              PaisRepository paisRepository) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
    }

    @Override
    public ApiResponse<Ranking> getRanking(long id) {
        List<Usuario> usuarios = this.usuarioRepository.findAll();
        List<Ranking> rankings = this.calcularRankings(usuarios);
        Ranking ranking = rankings
                .stream()
                .filter(r -> r.getUsuario() == id)
                .findAny()
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat
                        .format("El Usuario id {0} no se encuentra en el sistema", id)));
        return ok(ranking);
    }

    @Override
    public ApiResponse<List<Ranking>> getAllRanking(String pais, int size) {


        List<Usuario> usuarios;

        if (pais == null || pais.isEmpty()) {
            usuarios = this.usuarioRepository.findAll();
        } else {
            usuarios = this.usuarioRepository.findByCountry(pais);
        }

        List<Ranking> rankings = calcularRankings(usuarios);
        if (size > 0) {
            int s = rankings.size();
            if (s > size) {
                s = size;
            }
            return ok(rankings.subList(0, s));
        } else {
            return ok(rankings);
        }
    }

    @Transactional
    List<Ranking> calcularRankings(List<Usuario> usuarios) {
        List<Ranking> rankings = usuarios.stream()
                .map(usuario -> {
                    Ranking ranking = new Ranking();
                    ranking.setNombre(usuario.getNombre() + " " + usuario.getApellido());
                    ranking.setPais(usuario.getPais().getNombre());
                    ranking.setUsuario(usuario.getId());
                    ranking.setPuntos(usuario.getPuntos());
                    return ranking;
                })
                .sorted(Comparator.comparingInt(Ranking::getPuntos).reversed())
                .collect(toList());

        return IntStream
                .range(0, rankings.size())
                .mapToObj(i -> {
                    Ranking r = rankings.get(i);
                    r.setRanking(i + 1);
                    return r;
                }).collect(toList());
    }
}
