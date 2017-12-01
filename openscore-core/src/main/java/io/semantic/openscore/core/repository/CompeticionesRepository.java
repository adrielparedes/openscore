package io.semantic.openscore.core.repository;

import javax.ejb.Stateless;

import io.semantic.openscore.core.model.Competicion;

@Stateless
public class CompeticionesRepository extends Repository<Competicion> {

    public CompeticionesRepository() {
        super(Competicion.class);
    }
}
