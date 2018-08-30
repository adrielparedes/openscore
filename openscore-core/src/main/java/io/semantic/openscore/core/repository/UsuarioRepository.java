package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Usuario;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

@Stateless
public class UsuarioRepository extends Repository<Usuario> {

    public static final String FIND_BY_EMAIL = "from Usuario s where s.email=:email";
    public static final String FIND_BY_COUNTRY = "from Usuario s where s.pais.codigo=:pais";

    @Inject
    public UsuarioRepository() {
        super(Usuario.class);
    }

    public UsuarioRepository(EntityManager entityManager) {
        super(Usuario.class);
        this.entityManager = entityManager;

    }

    public Optional<Usuario> findByEmail(String email) {
        List<Usuario> found = this.createQuery(FIND_BY_EMAIL).setParameter("email", email).getResultList();

        if (!found.isEmpty()) {
            return Optional.of(found.get(0));
        } else {
            return Optional.empty();
        }
    }

    public boolean exist(String email) {
        return this.findByEmail(email).isPresent();
    }

    public List<Usuario> findByCountry(String pais) {
        List<Usuario> found = this.createQuery(FIND_BY_COUNTRY).setParameter("pais", pais.toUpperCase()).getResultList();
        return found;
    }
}
