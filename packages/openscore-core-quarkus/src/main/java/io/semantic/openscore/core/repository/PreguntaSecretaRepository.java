package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.PreguntaSecreta;

import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;

@RequestScoped
public class PreguntaSecretaRepository extends Repository<PreguntaSecreta> {


    public PreguntaSecretaRepository() {
        super(PreguntaSecreta.class);
    }

    public PreguntaSecretaRepository(EntityManager entityManager) {
        super(PreguntaSecreta.class, entityManager);
    }


    @Override
    public boolean exist(PreguntaSecreta entity) {
        return false;
    }
}
