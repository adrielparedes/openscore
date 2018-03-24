package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Pronostico;

import java.util.List;
import java.util.Optional;

public class PronosticoRepository extends Repository<Pronostico> {

    private static final String FIND_BY_ID_AND_USER = "select e from Pronostico e where " +
            "e.id = :id and " +
            "e.usuario.id = :idUsuario and " +
            "e.deleted = false";

    private static final String FIND_BY_PARTIDO_AND_USER = "select e from Pronostico e where " +
            "e.partido.id = :idPartido and " +
            "e.usuario.id = :idUsuario and " +
            "e.deleted = false";

    private static final String FIND_BY_USER = "select e from Pronostico e where " +
            "e.usuario.id = :idUsuario";

    public PronosticoRepository() {
        super(Pronostico.class);
    }

    public List<Pronostico> findByUsuario(long idUsuario) {
        return this.createQuery(FIND_BY_USER)
                .setParameter("idUsuario", idUsuario)
                .getResultList();
    }

    public Optional<Pronostico> findById(long id, long idUsuario) {
        List<Pronostico> results = this.createQuery(FIND_BY_ID_AND_USER)
                .setParameter("id", id)
                .setParameter("idUsuario", idUsuario)
                .getResultList();

        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(results.get(0));
        }
    }

    public Optional<Pronostico> findByPartidoAndUsuario(long idPartido, long idUsuario) {
        List<Pronostico> results = this.createQuery(FIND_BY_PARTIDO_AND_USER)
                .setParameter("idPartido", idPartido)
                .setParameter("idUsuario", idUsuario)
                .getResultList();

        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(results.get(0));
        }
    }
}
