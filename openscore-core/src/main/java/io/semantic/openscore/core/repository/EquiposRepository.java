package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.model.Pais;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;

@Stateless
public class EquiposRepository extends Repository<Equipo> {

    public EquiposRepository() {
        super(Equipo.class);
    }

    public boolean exist(String codigo) {
        TypedQuery<Equipo> query = this.createQuery("select p from Equipo p where p.codigo = :codigo");
        query.setParameter("codigo", codigo);
        return this.findByQuery(query).size() > 0;
    }
}
