package io.semantic.openscore.core.services;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CompeticionApi;
import io.semantic.openscore.core.api.competiciones.CrearCompeticionApi;

@Path("competiciones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface CompeticionesService {

    @GET
    @Path("/")
    ApiResponse<List<CompeticionApi>> getCompeticiones(@QueryParam("page") int page,
                                                       @QueryParam("pageSize") int pageSize);

    @GET
    @Path("/{id}")
    ApiResponse<CompeticionApi> getCompeticion(@PathParam("id") Long id);

    @POST
    @Path("/")
    ApiResponse<CompeticionApi> addCompeticion(CrearCompeticionApi competicionApi);
}
