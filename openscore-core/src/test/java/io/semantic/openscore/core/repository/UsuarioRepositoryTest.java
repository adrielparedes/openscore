package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Usuario;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class UsuarioRepositoryTest extends RepositoryBaseTest {

    private UsuarioRepository repository;
    private Logger logger = LoggerFactory.getLogger(RepositoryTest.class);

    @Test
    public void testFindByEmail() {
        String email = "john.frusciante@gmail.com";

        Usuario newUser = new Usuario();

        newUser.setNombre("John");
        newUser.setApellido("Frusciante");
        newUser.setEmail(email);
        newUser.setPassword("anthony_kiedis");

        Pais pais = new Pais();
        pais.setNombre("Argentina");
        pais.setCodigo("ARG");

        PaisRepository paisRepository = new PaisRepository(this.entityManager);
        transaction(() -> paisRepository.save(pais));

        newUser.setPais(pais);

        transaction(() -> this.repository.save(newUser));

        Optional<Usuario> user = this.repository.findByEmail(email);

        assertEquals(email, user.get().getEmail());
    }

    @Override
    protected void beforeEach() {
        this.repository = new UsuarioRepository(this.entityManager);
    }
}