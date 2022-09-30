package io.semantic.openscore.core.repository;

import java.util.List;
import java.util.Optional;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.TypedQuery;

import io.semantic.openscore.core.model.Grupo;

@ApplicationScoped
public class GrupoRepository extends Repository<Grupo> {

    private static final String FIND_ENTITY_BY_CODIGO_QUERY = "select p from Grupo p where p.codigo = :codigo";

    public GrupoRepository() {
        super(Grupo.class);
    }

    public boolean exist(String codigo) {
        TypedQuery<Grupo> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        return this.findByQuery(query).size() > 0;
    }

    public Optional<Grupo> findByCodigo(String codigo) {
        TypedQuery<Grupo> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        List<Grupo> found = this.findByQuery(query);
        if (found.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(found.get(0));
        }
    }

    @Override
    public boolean exist(Grupo entity) {
        return false;
    }
}
