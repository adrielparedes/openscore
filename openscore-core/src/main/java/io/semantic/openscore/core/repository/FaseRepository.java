package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Fase;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Stateless
public class FaseRepository extends Repository<Fase> {

    private static final String FIND_ENTITY_BY_CODIGO_QUERY = "select p from Fase p where p.codigo = :codigo";

    public FaseRepository() {
        super(Fase.class);
    }

    public boolean exist(String codigo) {
        TypedQuery<Fase> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        return this.findByQuery(query).size() > 0;
    }

    public Optional<Fase> findByCodigo(String codigo) {
        TypedQuery<Fase> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        List<Fase> results = query.getResultList();
        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(results.get(0));
        }
    }
}
