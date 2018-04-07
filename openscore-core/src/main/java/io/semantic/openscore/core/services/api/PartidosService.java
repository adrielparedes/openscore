package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("partidos")
public interface PartidosService {

    @GET
    @Path("/")
    ApiResponse<List<PartidoDTO>> getAll(@QueryParam("page") int page,
                                         @QueryParam("pageSize") int pageSize,
                                         @QueryParam("grupo") String grupo,
                                         @QueryParam("fase") String fase,
                                         @QueryParam("fecha") long fecha,
                                         @QueryParam("equipo") String equipo);

    @GET
    @Path("/{id}")
    ApiResponse<PartidoDTO> get(@PathParam("id") long id);

    @DELETE
    @PathParam("/{id}")
    ApiResponse<Long> delete(@PathParam("id") long id);

    @POST
    @PathParam("/")
    ApiResponse<PartidoDTO> add(CrearOUpdatePartidoDTO entity);

    @POST
    @PathParam("/{id}")
    ApiResponse<PartidoDTO> update(@PathParam("id") long id, CrearOUpdatePartidoDTO entity);
}
