package io.semantic.openscore.core.services.filters;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@PreMatching
@Provider
public class CorsFilter implements ContainerResponseFilter {

    private Logger logger = LoggerFactory.getLogger(CorsFilter.class);

    private static final String ACCESS_CONTROL_ALLOW_ORIGIN = "Access-Control-Allow-Origin";
    private static final String ACCESS_CONTROL_ALLOW_METHODS = "Access-Control-Allow-Methods";
    private static final String ACCESS_CONTROL_MAX_AGE = "Access-Control-Max-Age";
    private static final String ACCESS_CONTROL_ALLOW_CREDENTIALS = "Access-Control-Allow-Credentials";
    private static final String ACCESS_CONTROL_ALLOW_HEADERS = "Access-Control-Allow-Headers";

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) throws IOException {

        responseContext.getHeaders().add(ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        responseContext.getHeaders().add(ACCESS_CONTROL_ALLOW_METHODS, "GET, POST, PUT, DELETE, OPTIONS, HEAD".toUpperCase());
        responseContext.getHeaders().add(ACCESS_CONTROL_MAX_AGE, "-1");
        responseContext.getHeaders().add(ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        responseContext.getHeaders().add(ACCESS_CONTROL_ALLOW_HEADERS, "Authorization, Origin, Content-Type, Accept".toLowerCase());
    }

}
