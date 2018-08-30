package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;
import io.semantic.openscore.core.security.TokenGenerator;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.HashSet;

public class CrearUsuarioAdmin implements StartupStep {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;
    private TokenGenerator tokenGenerator;

    public CrearUsuarioAdmin() {

    }

    @Inject
    public CrearUsuarioAdmin(UsuarioRepository usuarioRepository,
                             PaisRepository paisRepository,
                             TokenGenerator tokenGenerator) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
    }

    @Override
    public void run() {
//        this.crearUsuarioSiNoExiste("admin@admin.com", this.crearUsuarioAdmin());
        this.crearUsuarioSiNoExiste("aparedes@redhat.com", this.crearUsuarioAparedes());
        this.crearUsuarioSiNoExiste("lberetta@redhat.com", this.crearUsuarioLberetta());

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
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("admin@admin.com");
        usuario.setApellido("Admin");
        usuario.setNombre("Admin");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioAparedes() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("aparedes@redhat.com");
        usuario.setApellido("Paredes");
        usuario.setNombre("Adriel");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioLberetta() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("lberetta@redhat.com");
        usuario.setApellido("Beretta");
        usuario.setNombre("Leandro");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

}
