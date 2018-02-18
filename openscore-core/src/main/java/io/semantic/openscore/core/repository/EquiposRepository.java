package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Equipo;

import javax.ejb.Stateless;

@Stateless
public class EquiposRepository extends Repository {

    public EquiposRepository() {
        super(Equipo.class);
    }
}
