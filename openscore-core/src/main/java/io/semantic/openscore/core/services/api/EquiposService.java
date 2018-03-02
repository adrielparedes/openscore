package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.equipos.CrearEquipoDTO;
import io.semantic.openscore.core.api.equipos.EquipoDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface EquiposService extends StandardService<EquipoDTO, CrearEquipoDTO, CrearEquipoDTO> {
}
