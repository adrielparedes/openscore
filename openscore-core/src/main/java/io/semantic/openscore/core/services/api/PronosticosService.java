package io.semantic.openscore.core.services.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.security.Secure;

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
        ApiResponse<PartidoPronosticoDTO> get(@PathParam("id") long id);

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
        ApiResponse<PartidoPronosticoDTO> local(@PathParam("id") long idPartido);

        @Path("/{id}/empate")
        @POST
        @Secure
        ApiResponse<PartidoPronosticoDTO> empate(@PathParam("id") long idPartido);

        @Path("/{id}/visitante")
        @POST
        @Secure
        ApiResponse<PartidoPronosticoDTO> visitante(@PathParam("id") long idPartido);

}
