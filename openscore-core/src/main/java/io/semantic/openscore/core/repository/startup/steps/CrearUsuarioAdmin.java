package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.PreguntaSecreta;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.PreguntaSecretaRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;
import io.semantic.openscore.core.security.TokenGenerator;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import java.util.Arrays;
import java.util.HashSet;

public class CrearUsuarioAdmin implements StartupStep {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;
    private TokenGenerator tokenGenerator;
    private PreguntaSecretaRepository preguntaSecretaRepository;

    public CrearUsuarioAdmin() {

    }

    @Inject
    public CrearUsuarioAdmin(UsuarioRepository usuarioRepository,
                             PaisRepository paisRepository,
                             TokenGenerator tokenGenerator,
                             PreguntaSecretaRepository preguntaSecretaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
        this.preguntaSecretaRepository = preguntaSecretaRepository;
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
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("admin@admin.com");
        usuario.setApellido("Admin");
        usuario.setNombre("Admin");
        usuario.setPreguntaSecreta(this.getPreguntaSecreta(PreguntaSecreta.PRODUCTO_REDHAT_FAVORITO));
        usuario.setRespuestaPreguntaSecreta("openshift");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioJohn() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("aparedes@redhat.com");
        usuario.setApellido("Paredes");
        usuario.setNombre("Adriel");
        usuario.setPreguntaSecreta(this.getPreguntaSecreta(PreguntaSecreta.LENGUAJE_PROGRAMACION_FAVORITO));
        usuario.setRespuestaPreguntaSecreta("haskell");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private Usuario crearUsuarioJimi() {
        Usuario usuario = new Usuario();
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.ADMIN, Rol.USUARIO)));
        usuario.setEmail("lberetta@redhat.com");
        usuario.setApellido("Beretta");
        usuario.setNombre("Leandro");
        usuario.setPreguntaSecreta(this.getPreguntaSecreta(PreguntaSecreta.BANDA_FAVORITA));
        usuario.setRespuestaPreguntaSecreta("RHCP");
        usuario.setPassword(tokenGenerator.generarPassword("admin"));
        usuario.setPais(this.paisRepository.findByCodigo("ARG"));
        return usuario;
    }

    private PreguntaSecreta getPreguntaSecreta(String codigo) {
        return this.preguntaSecretaRepository.findByCodigo(codigo).orElseThrow(() -> new IllegalArgumentException("La pregunta secreta no existe"));
    }
}
