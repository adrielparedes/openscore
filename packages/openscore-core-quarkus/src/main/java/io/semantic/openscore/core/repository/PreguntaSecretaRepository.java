package io.semantic.openscore.core.repository;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;

import io.semantic.openscore.core.model.PreguntaSecreta;

@ApplicationScoped
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
