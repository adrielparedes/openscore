package io.semantic.openscore.core.services.filters;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import io.semantic.openscore.core.exceptions.ApplicationException;
import io.semantic.openscore.core.exceptions.ValidationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.semantic.openscore.core.services.RestUtil.error;

@Provider
public class ApplicationExceptionMapper implements ExceptionMapper<ApplicationException> {

    private Logger logger = LoggerFactory.getLogger(ApplicationExceptionMapper.class);

    @Override
    public Response toResponse(ApplicationException exception) {
        logger.error(exception.getMessage(), exception);

        Object data = null;

        if (exception instanceof ValidationException) {
            data = ((ValidationException) exception).getData();
        }

        return Response
                .status(500)
                .type(MediaType.APPLICATION_JSON_TYPE)
                .entity(error("ERROR",
                        exception.getMessage(),
                        data))
                .build();
    }
}
