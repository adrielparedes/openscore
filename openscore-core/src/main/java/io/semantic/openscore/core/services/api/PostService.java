package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.post.CrearPost;
import io.semantic.openscore.core.model.Post;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/posts")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface PostService extends StandardService<Post, CrearPost, CrearPost> {

    @Path("/")
    @GET
    ApiResponse<List<Post>> getAll(@QueryParam("page") int page,
                                   @QueryParam("pageSize") int pageSize,
                                   @QueryParam("status") String status);

    @Path("{id}/publicar")
    @POST
    ApiResponse<Post> publicar(@PathParam("id") long id);

    @Path("{id}/retirar")
    @POST
    ApiResponse<Post> retirar(@PathParam("id") long id);

}
