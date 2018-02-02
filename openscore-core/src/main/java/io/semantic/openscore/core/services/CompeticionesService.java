package io.semantic.openscore.core.services;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CompeticionApi;
import io.semantic.openscore.core.api.competiciones.CrearCompeticionApi;
import io.semantic.openscore.core.model.Partido;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Set;

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
    ApiResponse<CompeticionApi> getCompeticion(@PathParam("id") long id);

    @POST
    @Path("/")
    ApiResponse<CompeticionApi> addCompeticion(CrearCompeticionApi competicionApi);

    @POST
    @Path("{id}/partidos")
    ApiResponse<CompeticionApi> addPartidos(@PathParam("id") String id, Set<Partido> partidos);
}
