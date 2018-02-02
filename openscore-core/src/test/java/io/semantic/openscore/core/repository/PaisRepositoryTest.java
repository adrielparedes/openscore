package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Pais;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PaisRepositoryTest extends RepositoryBaseTest {

    private PaisRepository paisRepository;

    @Override
    protected void beforeEach() {
        paisRepository = new PaisRepository(entityManager);
    }

    @Test
    void testExistPais() {


        assertFalse(this.paisRepository.exist("ARG"));

        Pais pais = new Pais();
        pais.setNombre("Argentina");
        pais.setCodigo("ARG");

        transaction(() -> this.paisRepository.save(pais));
        assertTrue(this.paisRepository.exist("ARG"));

    }
}