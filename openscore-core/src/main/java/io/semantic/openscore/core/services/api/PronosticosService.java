package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("pronosticos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PronosticosService extends StandardService<PronosticoDTO, CrearPronosticoDTO, CrearPronosticoDTO> {


    @Path("/:id/local")
    @POST
    ApiResponse<PronosticoDTO> local(@PathParam("id") long idPartido);

    @Path("/:id/empate")
    @POST
    ApiResponse<PronosticoDTO> empate(@PathParam("id") long idPartido);

    @Path("/:id/visitante")
    @POST
    ApiResponse<PronosticoDTO> visitante(@PathParam("id") long idPartido);

}
