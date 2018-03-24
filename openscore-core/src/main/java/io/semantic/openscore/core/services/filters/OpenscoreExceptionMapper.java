package io.semantic.openscore.core.services.filters;

import io.semantic.openscore.core.api.ApiResponse;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class OpenscoreExceptionMapper implements ExceptionMapper<RuntimeException> {

    @Override
    public Response toResponse(RuntimeException e) {
        return Response.serverError().entity(new ApiResponse<>("500", e.getMessage(), null)).build();
    }
}
