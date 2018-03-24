package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.TokenGenerator;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import java.util.Arrays;
import java.util.HashSet;

public class CrearUusuarioAdmin implements StartupStep {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;
    private TokenGenerator tokenGenerator;

    public CrearUusuarioAdmin() {

    }

    @Inject
    public CrearUusuarioAdmin(UsuarioRepository usuarioRepository,
                              PaisRepository paisRepository,
                              TokenGenerator tokenGenerator) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
    }

    @Override
    public void run() {
        this.crearUsuarioSiNoExiste("admin@admin", this.crearUsuarioAdmin());

    }

    @Override
    public int priority() {
        return 100;
    }

    private void crearUsuarioSiNoExiste(String email, Usuario usuario) {
        if (!this.usuarioRepository.findByEmail(email).isPresent()) {
            this.usuarioRepository.save(usuario);
        }
    }

    private Usuario crearUsuarioAdmin() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN)));
        usuario.setEmail("admin@admin");
        usuario.setApellido("Admin");
        usuario.setNombre("Admin");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }
}
