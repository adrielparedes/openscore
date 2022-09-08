package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Pais;

import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;

@RequestScoped
public class PaisRepository extends Repository<Pais> {

    private static final String FIND_PAIS_BY_CODIGO_QUERY = "select p from Pais p where p.codigo = :codigo";

    public PaisRepository() {
        super(Pais.class);
    }

    public PaisRepository(EntityManager entityManager) {
        super(Pais.class, entityManager);
    }

    public boolean exist(Pais pais) {
        TypedQuery<Pais> query = this.createQuery("select p from Pais p where p.codigo = :codigo");
        query.setParameter("codigo", pais.getCodigo());
        return this.findByQuery(query).size() > 0;
    }

    public boolean exist(String codigo) {
        TypedQuery<Pais> query = this.createQuery("select p from Pais p where p.codigo = :codigo");
        query.setParameter("codigo", codigo);
        return this.findByQuery(query).size() > 0;
    }

    public Pais findByCodigo(String codigo) {
        TypedQuery<Pais> query = this.createQuery(FIND_PAIS_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        return query.getSingleResult();
    }
}
