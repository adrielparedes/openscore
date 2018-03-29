package io.semantic.openscore.core.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.ext.Provider;

@Provider
@Secure
public class SecureFilter implements ContainerRequestFilter {

    private Logger logger = LoggerFactory.getLogger(SecureFilter.class);

    @Override
    public void filter(ContainerRequestContext containerRequestContext) {
        logger.info("secure filter");
        TokenGenerator tokenGenerator = new TokenGenerator();

        tokenGenerator.verify(tokenGenerator.getTokenFromAuthHeader(containerRequestContext.getHeaderString("Authorization")));
    }
}

