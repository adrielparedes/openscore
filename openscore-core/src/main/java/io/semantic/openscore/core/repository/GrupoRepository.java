package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Grupo;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;

@Stateless
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

    public Grupo findByCodigo(String codigo) {
        TypedQuery<Grupo> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        return query.getSingleResult();
    }
}
