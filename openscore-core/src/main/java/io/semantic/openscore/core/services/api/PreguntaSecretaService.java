package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.PreguntaSecreta;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("preguntas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PreguntaSecretaService extends GetService<PreguntaSecreta> {
}
