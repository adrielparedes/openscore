package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Usuario;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;

@Stateless
public class UsuarioRepository extends Repository<Usuario> {

    @Inject
    public UsuarioRepository() {
        super(Usuario.class);
    }

    public UsuarioRepository(EntityManager entityManager) {
        super(Usuario.class);
        this.entityManager = entityManager;

    }

    public Optional<Usuario> findByEmail(String email) {
        List<Usuario> found = this.createQuery(MessageFormat.format("from {0} s where s.email=:email",
                this.persistentClass.getSimpleName())).setParameter("email", email).getResultList();

        if (!found.isEmpty()) {
            return Optional.of(found.get(0));
        } else {
            return Optional.empty();
        }
    }
}
