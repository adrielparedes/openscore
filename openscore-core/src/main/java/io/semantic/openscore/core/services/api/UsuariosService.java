package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.TokenDTO;
import io.semantic.openscore.core.api.usuarios.*;
import io.semantic.openscore.core.security.Secure;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface UsuariosService extends SearchService<UsuarioDTO> {

    @POST
    @Path("/registrar")
    ApiResponse<UsuarioDTO> registrarUsuario(CrearUsuarioDTO crearUsuario);

    @POST
    @Path("/update/{id}")
    @Secure
    ApiResponse<TokenDTO> updateUsuario(@PathParam("id") long id, UpdateUsuarioDTO crearUsuario);


    @POST
    @Path("/password")
    @Secure
    ApiResponse<UsuarioDTO> updatePassword(UpdatePassword updatePassword);

    @POST
    @Path("/recover")
    ApiResponse<UsuarioDTO> recoverPassword(RecoverPassword updatePassword);

    @GET
    @Path("/token/{email}")
    ApiResponse<String> sendToken(@PathParam("email") String email);


    ApiResponse<String> deleteUsuario(long id);

    @GET
    @Path("/{id}")
    @Secure
    ApiResponse<UsuarioDTO> getUsuario(@PathParam("id") Long id);

    @GET
    @Path("/myself")
    @Secure
    ApiResponse<UsuarioDTO> getMiUsuario();

    @GET
    @Path("/")
    @Secure
    ApiResponse<List<UsuarioDTO>> getAll(@QueryParam("page") int page, @QueryParam("pageSize") int pageSize, @QueryParam("filter") String filter);

    @POST
    @Path("/login")
    ApiResponse<TokenDTO> login(LoginUsuarioDTO loginUsuario);

}
