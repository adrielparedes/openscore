package io.semantic.openscore.core.services.filters;

import io.semantic.openscore.core.api.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class RuntimeExceptionMapper implements ExceptionMapper<RuntimeException> {

    private Logger logger = LoggerFactory.getLogger(ApplicationExceptionMapper.class);

    @Override
    public Response toResponse(RuntimeException e) {
        logger.error(e.getLocalizedMessage(), e);
        return Response
                .serverError()
                .type(MediaType.APPLICATION_JSON_TYPE)
                .entity(new ApiResponse<>("500", e.getMessage(), null)).build();
    }
}
