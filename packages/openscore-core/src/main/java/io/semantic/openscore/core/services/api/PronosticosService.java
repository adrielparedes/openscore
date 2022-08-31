package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.security.Secure;

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
    @Secure
    ApiResponse<List<PartidoPronosticoDTO>> getAll(@QueryParam("page") int page,
                                                   @QueryParam("pageSize") int pageSize,
                                                   @QueryParam("grupo") String grupo,
                                                   @QueryParam("fase") String fase,
                                                   @QueryParam("dia") long dia,
                                                   @QueryParam("fecha") int fecha);

    @Path("/{id}")
    @GET
    @Secure
    ApiResponse<PronosticoDTO> get(@PathParam("id") long id);

    @Path("/{id}")
    @DELETE
    @Secure
    ApiResponse<Long> delete(@PathParam("id") long id);

    @Path("/")
    @POST
    @Secure
    ApiResponse<PronosticoDTO> add(CrearPronosticoDTO entity);

    @Path("/{id}")
    @POST
    @Secure
    ApiResponse<PronosticoDTO> update(@PathParam("id") long id,
                                      CrearPronosticoDTO entity);

    @Path("/{id}/local")
    @POST
    @Secure
    ApiResponse<PronosticoDTO> local(@PathParam("id") long idPartido);

    @Path("/{id}/empate")
    @POST
    @Secure
    ApiResponse<PronosticoDTO> empate(@PathParam("id") long idPartido);

    @Path("/{id}/visitante")
    @POST
    @Secure
    ApiResponse<PronosticoDTO> visitante(@PathParam("id") long idPartido);

}
