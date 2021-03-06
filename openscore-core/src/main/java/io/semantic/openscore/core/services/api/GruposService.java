package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.model.Grupo;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("grupos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface GruposService extends GetService<Grupo> {
}
