package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;
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
        this.crearUsuarioSiNoExiste("admin@admin.com", this.crearUsuarioAdmin());
        this.crearUsuarioSiNoExiste("john@redhat.com", this.crearUsuarioJohn());
        this.crearUsuarioSiNoExiste("jimi@redhat.com", this.crearUsuarioJimi());

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
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN,Rol.USUARIO)));
        usuario.setEmail("admin@admin.com");
        usuario.setApellido("Admin");
        usuario.setNombre("Admin");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioJohn() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.USUARIO)));
        usuario.setEmail("john@redhat.com");
        usuario.setApellido("John");
        usuario.setNombre("Frusciante");
        usuario.setPassword(tokenGenerator.generarPassword("redhat.1"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioJimi() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.USUARIO)));
        usuario.setEmail("jimi@redhat.com");
        usuario.setApellido("Jimi");
        usuario.setNombre("Hendrix");
        usuario.setPassword(tokenGenerator.generarPassword("redhat.1"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }
}
