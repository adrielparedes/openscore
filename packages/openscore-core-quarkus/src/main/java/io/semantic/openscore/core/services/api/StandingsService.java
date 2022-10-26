package io.semantic.openscore.core.services.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.Standing;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("standings")
public interface StandingsService extends SearchService<Standing> {

    @Path("calculate")
    @GET
    ApiResponse<String> calculate();

}
