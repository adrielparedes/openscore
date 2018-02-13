package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.admin.UsuarioApi;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface AdminService extends LuceneSearchService<UsuarioApi> {


}
