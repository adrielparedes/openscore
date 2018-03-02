package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioApi;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface UsuariosService extends LuceneSearchService<UsuarioDTO> {


    @POST
    @Path("/registrar")
    ApiResponse<UsuarioDTO> registrarUsuario(CrearUsuarioDTO crearUsuario);

    ApiResponse<String> deleteUsuario(long id);

    ApiResponse<String> getUsuario(long id);

    ApiResponse<UsuarioDTO> login(LoginUsuarioApi loginUsuario);

}
