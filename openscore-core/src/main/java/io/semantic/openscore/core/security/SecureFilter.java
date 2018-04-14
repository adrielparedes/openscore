package io.semantic.openscore.core.security;

import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;
import java.util.Arrays;
import java.util.List;

@Provider
@Secure
public class SecureFilter implements ContainerRequestFilter {

    @Context
    ResourceInfo resourceInfo;

    private Logger logger = LoggerFactory.getLogger(SecureFilter.class);
    private UserInfo userInfo;

    public SecureFilter() {

    }

    @Inject
    public SecureFilter(UserInfo userInfo, UsuarioRepository usuarioRepository) {
        this.userInfo = userInfo;
    }

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {

        Secure secure = resourceInfo.getResourceMethod().getAnnotation(Secure.class);
        List<Rol> roles = Arrays.asList(secure.value());

        logger.info("secure filter");
        TokenGenerator tokenGenerator = new TokenGenerator();
        tokenGenerator.verify(tokenGenerator.getTokenFromAuthHeader(containerRequestContext.getHeaderString(HttpHeaders.AUTHORIZATION)));


//        TokenGenerator tokenGenerator = new TokenGenerator();
//        String token = tokenGenerator.getTokenFromAuthHeader(containerRequestContext.getHeaderString("Authorization"));
//
//        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(tokenGenerator.getMail(token));
//        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("usuario inexistente"));
//
//        if (!usuario.getRoles().contains(Rol.ADMIN))
//            throw new NotAuthorizedException("invalid permissions");
    }
}

