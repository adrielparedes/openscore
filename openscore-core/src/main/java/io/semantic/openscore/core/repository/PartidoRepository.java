package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Partido;

import javax.ejb.Stateless;

@Stateless
public class PartidoRepository extends Repository<Partido> {

    public PartidoRepository() {
        super(Partido.class);
    }

}
