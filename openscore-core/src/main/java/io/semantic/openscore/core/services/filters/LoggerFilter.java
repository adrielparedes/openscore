package io.semantic.openscore.core.services.filters;

import com.google.common.io.CharStreams;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.ext.Provider;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@PreMatching
@Provider
public class LoggerFilter implements ContainerRequestFilter {

    private Logger logger = LoggerFactory.getLogger(LoggerFilter.class);


    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        byte[] byteArray = IOUtils.toByteArray(requestContext.getEntityStream());
        InputStream entity = new ByteArrayInputStream(byteArray);
        logger.info(CharStreams.toString(new InputStreamReader(entity)));
        requestContext.setEntityStream(new ByteArrayInputStream(byteArray));
    }
}
