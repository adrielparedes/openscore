package io.semantic.openscore.core.services.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.equipos.CrearEquipoDTO;
import io.semantic.openscore.core.api.equipos.EquipoDTO;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface EquiposService extends StandardService<EquipoDTO, CrearEquipoDTO, CrearEquipoDTO> {

    @Path("/")
    @GET
    ApiResponse<List<EquipoDTO>> getAll(@QueryParam("page") int page,
            @QueryParam("pageSize") int pageSize);

    @Path("/count")
    @GET
    ApiResponse<Long> count();
}
