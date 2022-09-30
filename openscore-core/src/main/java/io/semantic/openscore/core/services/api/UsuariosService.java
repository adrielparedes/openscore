package io.semantic.openscore.core.services.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.TokenDTO;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.RecoverPassword;
import io.semantic.openscore.core.api.usuarios.UpdatePassword;
import io.semantic.openscore.core.api.usuarios.UpdateUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.security.Secure;

@Path("usuarios")
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
        ApiResponse<List<UsuarioDTO>> getAll(@QueryParam("page") int page, @QueryParam("pageSize") int pageSize,
                        @QueryParam("filter") String filter);

        @POST
        @Path("/login")
        ApiResponse<TokenDTO> login(LoginUsuarioDTO loginUsuario);

        @GET
        @Path("/count")
        ApiResponse<Long> count();

        @DELETE
        @Path("/{id}")
        ApiResponse<Long> delete(@PathParam("id") long id);

        @POST
        @Path("/{id}/enable")
        ApiResponse<Long> enable(@PathParam("id") long id);

        @POST
        @Path("/{id}/disable")
        ApiResponse<Long> disable(@PathParam("id") long id);

}
