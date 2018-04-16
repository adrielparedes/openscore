package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Date;
import java.util.List;

@Path("pronosticos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PronosticosService {

    @Path("/")
    @GET
    ApiResponse<List<PartidoPronosticoDTO>> getAll(@QueryParam("page") int page,
                                                   @QueryParam("pageSize") int pageSize,
                                                   @QueryParam("grupo") String grupo,
                                                   @QueryParam("fecha") String fecha);

    @Path("/{id}")
    @GET
    ApiResponse<PronosticoDTO> get(@PathParam("id") long id);

    @Path("/{id}")
    @DELETE
    ApiResponse<Long> delete(@PathParam("id") long id);

    @Path("/")
    @POST
    ApiResponse<PronosticoDTO> add(CrearPronosticoDTO entity);

    @Path("/{id}")
    @POST
    ApiResponse<PronosticoDTO> update(@PathParam("id") long id,
                                      CrearPronosticoDTO entity);

    @Path("/{id}/local")
    @POST
    ApiResponse<PronosticoDTO> local(@PathParam("id") long idPartido);

    @Path("/{id}/empate")
    @POST
    ApiResponse<PronosticoDTO> empate(@PathParam("id") long idPartido);

    @Path("/{id}/visitante")
    @POST
    ApiResponse<PronosticoDTO> visitante(@PathParam("id") long idPartido);

}
