package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.UpdateDefinicionCompeticionApi;
import io.semantic.openscore.core.model.DefinicionCompeticion;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;
import java.util.Set;

@Path("competiciones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DefinicionCompeticionesService {

    @GET
    @Path("/")
    ApiResponse<List<DefinicionCompeticion>> getCompeticiones(@QueryParam("page") int page,
                                                              @QueryParam("pageSize") int pageSize);

    @GET
    @Path("/{id}")
    ApiResponse<DefinicionCompeticion> getCompeticion(@PathParam("id") long id);

    @DELETE
    @Path("/{id}")
    ApiResponse<Long> deleteCompeticion(@PathParam("id") long id);

    @POST
    @Path("/")
    ApiResponse<DefinicionCompeticion> addCompeticion(CrearDefinicionCompeticionApi competicionApi);

    @POST
    @Path("/{id}")
    ApiResponse<DefinicionCompeticion> updateCompeticion(@PathParam("id") long id, UpdateDefinicionCompeticionApi competicionApi);

}
