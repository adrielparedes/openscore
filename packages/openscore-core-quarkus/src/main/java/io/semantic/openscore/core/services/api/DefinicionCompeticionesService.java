package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionDTO;
import io.semantic.openscore.core.api.competiciones.DefinicionCompeticionDTO;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("competiciones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DefinicionCompeticionesService extends StandardService<DefinicionCompeticionDTO, CrearDefinicionCompeticionDTO, CrearDefinicionCompeticionDTO> {


    @GET
    @Path("/{id}/partidos")
    ApiResponse<List<PartidoDTO>> getPartidos(@PathParam("id") long id);

    @GET
    @Path("/{id}/partidos/{idPartido")
    ApiResponse<PartidoDTO> getPartido(@PathParam("id") long id,
                                       @PathParam("idPartido") long idPartido);

    @POST
    @Path("/{id}/partidos")
    ApiResponse<PartidoDTO> addPartido(@PathParam("id") long id,
                                       CrearOUpdatePartidoDTO crearPartido);

    @POST
    @Path("/{id}/partidos/{idPartido}")
    ApiResponse<PartidoDTO> updatePartido(@PathParam("id") long id,
                                          @PathParam("idPartido") long idPartido,
                                          CrearOUpdatePartidoDTO crearOUpdatePartidoDTO);

    @DELETE
    @Path("/{id}/partidos/{idPartido}")
    ApiResponse<PartidoDTO> deletePartido(@PathParam("id") long id,
                                          @PathParam("idPartido") long idPartido);


}
