package io.semantic.openscore.core.repository;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.Query;
import javax.transaction.Transactional;

import io.semantic.openscore.core.model.Standing;

@ApplicationScoped
public class StandingsRepository extends Repository<Standing> {

    private static final String FIND_BY_GRUPO = "select e from Standing e where " +
            "e.grupo.codigo = :grupo " +
            "order by puntos DESC";

    public StandingsRepository() {
        super(Standing.class);
    }

    @Override
    public boolean exist(Standing entity) {
        return false;
    }

    public List<Standing> findByGrupo(String grupo) {
        return this.createQuery(FIND_BY_GRUPO)
                .setParameter("grupo", grupo)
                .getResultList();
    }

    @Transactional
    public void deleteAll() {

        Query query = this.entityManager.createQuery("DELETE FROM Standing");
        query.executeUpdate();
    }

}
