package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.TokenDTO;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.security.Admin;
import io.semantic.openscore.core.security.Secure;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

public interface UsuariosService extends SearchService<UsuarioDTO> {

    @POST
    @Path("/registrar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    ApiResponse<UsuarioDTO> registrarUsuario(CrearUsuarioDTO crearUsuario);
    ApiResponse<String> deleteUsuario(long id);

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Secure
    ApiResponse<UsuarioDTO> getUsuario(@PathParam("id") Long id);

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    @Secure
    @Admin
    public ApiResponse<List<UsuarioDTO>> getAll(@QueryParam("page") int page, @QueryParam("pageSize") int pageSize, @QueryParam("filter") String filter);

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    ApiResponse<TokenDTO> login(LoginUsuarioDTO loginUsuario);

}
