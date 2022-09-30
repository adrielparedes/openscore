package io.semantic.openscore.core.security;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Provider
@Secure
public class SecureFilter implements ContainerRequestFilter {

    @Context
    ResourceInfo resourceInfo;

    private Logger logger = LoggerFactory.getLogger(SecureFilter.class);
    private UserInfo userInfo;
    private UsuarioRepository usuarioRepository;

    public SecureFilter() {

    }

    @Inject
    public SecureFilter(UserInfo userInfo,
            UsuarioRepository usuarioRepository) {
        this.userInfo = userInfo;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {

        Secure secure = resourceInfo.getResourceMethod().getAnnotation(Secure.class);
        List<Rol> roles = Arrays.asList(secure.value());

        logger.info("Roles autorizados: {}", roles);

        TokenGenerator tokenGenerator = new TokenGenerator();
        String token = tokenGenerator
                .getTokenFromAuthHeader(containerRequestContext.getHeaderString(HttpHeaders.AUTHORIZATION));
        boolean isValid = tokenGenerator.verify(token);

        if (isValid) {
            logger.info("Token valido");
            Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(tokenGenerator.getMail(token));
            Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("usuario inexistente"));
            userInfo.setUsuario(usuario);
            if (!usuario.getRoles().stream().anyMatch(rol -> roles.contains(rol))) {
                logger.info("El usuario no contiene los roles necesarios");
                throw new NotAuthorizedException("El usuario no contiene los roles necesarios");
            } else {
                logger.info("El usuario contiene los roles, continua la operacion");
            }
        } else {
            logger.info("El token es invalido");
            throw new NotAuthorizedException("El token no es valido");
        }

    }
}
