package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Path("partidos")
public interface PartidosService extends StandardService<PartidoDTO, CrearOUpdatePartidoDTO, CrearOUpdatePartidoDTO> {
}
