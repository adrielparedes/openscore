package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.DefinicionCompeticionApi;
import io.semantic.openscore.core.api.competiciones.UpdateDefinicionCompeticionApi;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("competiciones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface DefinicionCompeticionesService extends StandardService<DefinicionCompeticionApi, CrearDefinicionCompeticionApi, UpdateDefinicionCompeticionApi> {

}
