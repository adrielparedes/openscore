package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioApi;
import io.semantic.openscore.core.api.usuarios.UsuarioApi;
import io.semantic.openscore.core.model.Usuario;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface UsuariosService extends LuceneSearchService<UsuarioApi> {


    @POST
    @Path("/registrar")
    ApiResponse<UsuarioApi> registrarUsuario(CrearUsuarioApi crearUsuario);

    ApiResponse<String> deleteUsuario(long id);

    ApiResponse<String> getUsuario(long id);

    ApiResponse<String> login();

}
