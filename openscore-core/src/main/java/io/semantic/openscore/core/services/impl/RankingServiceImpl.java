package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.ranking.Ranking;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.api.RankingService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class RankingServiceImpl implements RankingService {

    private UsuarioRepository usuarioRepository;

    public RankingServiceImpl() {
    }

    @Inject
    public RankingServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
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
    public ApiResponse<List<Ranking>> getAllRanking() {
        List<Usuario> usuarios = this.usuarioRepository.findAll();
        List<Ranking> rankings = calcularRankings(usuarios);
        return ok(rankings);
    }

    private List<Ranking> calcularRankings(List<Usuario> usuarios) {
        return usuarios.stream()
                .map(usuario -> {
                    Ranking ranking = new Ranking();
                    ranking.setNombre(usuario.getNombre() + " " + usuario.getApellido());
                    ranking.setNombre(usuario.getPais().getNombre());
                    ranking.setUsuario(usuario.getId());
                    ranking.setPuntos(usuario.getPuntos());
                    return ranking;
                })
                .sorted(Comparator.comparingInt(ranking -> ranking.getPuntos()))
                .collect(Collectors.toList());
    }
}
