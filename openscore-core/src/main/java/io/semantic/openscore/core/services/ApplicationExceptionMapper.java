package io.semantic.openscore.core.services;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import io.semantic.openscore.core.exceptions.ApplicationException;

import static io.semantic.openscore.core.services.RestUtil.error;

@Provider
public class ApplicationExceptionMapper implements ExceptionMapper<ApplicationException> {

    @Override
    public Response toResponse(ApplicationException exception) {
        return Response
                .status(500)
                .entity(error("ERROR",
                        exception.getMessage(),
                        null))
                .build();
    }
}
