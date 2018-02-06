package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Pais;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

@Stateless
public class PaisRepository extends Repository<Pais> {

    private static final String FIND_PAIS_BY_CODIGO_QUERY = "select p from Pais p where p.codigo = :codigo";

    public PaisRepository() {
        super(Pais.class);
    }

    public PaisRepository(EntityManager entityManager) {
        super(Pais.class, entityManager);
    }

    public boolean exist(String codigo) {
        TypedQuery<Pais> query = this.createQuery("select p from Pais p where p.codigo = :codigo");
        query.setParameter("codigo", codigo);
        return this.findByQuery(query, new Page(0, 1)).size() > 0;
    }

    public Pais findByCodigo(String codigo) {
        TypedQuery<Pais> query = this.createQuery(FIND_PAIS_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        return query.getSingleResult();
    }
}
