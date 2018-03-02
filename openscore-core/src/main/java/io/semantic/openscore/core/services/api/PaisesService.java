package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.paises.PaisDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("paises")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface PaisesService extends LuceneSearchService<PaisDTO> {


}
