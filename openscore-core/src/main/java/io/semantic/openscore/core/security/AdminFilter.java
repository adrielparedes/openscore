package io.semantic.openscore.core.security;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.UsuarioRepository;

import javax.inject.Inject;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;
import java.util.Optional;

@Provider
@Admin
public class AdminFilter implements ContainerRequestFilter {

    @Inject
    UsuarioRepository usuarioRepository;

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {
        TokenGenerator tokenGenerator = new TokenGenerator();
        String token = tokenGenerator.getTokenFromAuthHeader(containerRequestContext.getHeaderString("Authorization"));

        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(tokenGenerator.getMail(token));
        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("usuario inexistente"));

        if (!usuario.getRoles().contains(Rol.ADMIN))
            throw new NotAuthorizedException("invalid permissions");
    }
}