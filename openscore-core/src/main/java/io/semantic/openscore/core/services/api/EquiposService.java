package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.equipos.CrearEquipoDTO;
import io.semantic.openscore.core.api.equipos.EquipoDTO;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface EquiposService extends StandardService<EquipoDTO, CrearEquipoDTO, CrearEquipoDTO> {

    @Path("/")
    @GET
    ApiResponse<List<EquipoDTO>> getAll(@QueryParam("page") int page,
                                        @QueryParam("pageSize") int pageSize);
}
