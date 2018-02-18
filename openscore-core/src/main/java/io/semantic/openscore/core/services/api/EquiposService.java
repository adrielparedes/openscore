package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.equipos.CrearEquipoApi;
import io.semantic.openscore.core.api.equipos.EquipoApi;
import io.semantic.openscore.core.api.equipos.UpdateEquipoApi;

import javax.ws.rs.Consumes;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface EquiposService extends StandardService<EquipoApi, CrearEquipoApi, UpdateEquipoApi> {
}
