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
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.api.partidos.ResultadoDTO;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("partidos")
public interface PartidosService {

    @GET
    @Path("/")
    ApiResponse<List<PartidoDTO>> getAll(@QueryParam("page") int page,
            @QueryParam("size") int pageSize,
            @QueryParam("grupo") String grupo,
            @QueryParam("fase") String fase,
            @QueryParam("fecha") long fecha,
            @QueryParam("equipo") String equipo);

    @GET
    @Path("/{id}")
    ApiResponse<PartidoDTO> get(@PathParam("id") long id);

    @GET
    @Path("/count")
    ApiResponse<Long> count();

    @GET
    @Path("/fechas")
    ApiResponse<List<Integer>> getFechas();

    @DELETE
    @Path("/{id}")
    ApiResponse<Long> delete(@PathParam("id") long id);

    @POST
    @Path("/")
    ApiResponse<PartidoDTO> add(CrearOUpdatePartidoDTO entity);

    @POST
    @Path("/{id}")
    ApiResponse<PartidoDTO> update(@PathParam("id") long id, CrearOUpdatePartidoDTO entity);

    @POST
    @Path("{id}/resultado")
    ApiResponse<PartidoDTO> setResultado(@PathParam("id") long id, ResultadoDTO resultado);
}
