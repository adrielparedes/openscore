package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.information.Information;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("info")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface InformationService {

    @GET
    @Path("/")
    ApiResponse<Information> getInformation();

    @GET
    @Path("/ping/secure")
    ApiResponse<String> securePing();
}
