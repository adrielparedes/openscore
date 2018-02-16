package io.semantic.openscore.core.repository;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;

import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.model.Pais;

@Stateless
public class CompeticionesRepository extends Repository<DefinicionCompeticion> {

    public CompeticionesRepository() {
        super(DefinicionCompeticion.class);
    }

    public boolean exist(String nombre) {
        TypedQuery<DefinicionCompeticion> query = this.createQuery("select p from DefinicionCompeticion p where p.nombre= :nombre");
        query.setParameter("nombre", nombre);
        return this.findByQuery(query).size() > 0;
    }
}
