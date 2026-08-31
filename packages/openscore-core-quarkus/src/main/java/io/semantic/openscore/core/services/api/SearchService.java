package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public interface SearchService<T> {

    @GET
    @Path("/")
    ApiResponse<List<T>> getAll(@QueryParam("page") @DefaultValue("0") int page,
                                @QueryParam("pageSize") @DefaultValue("10") int pageSize,
                                @QueryParam("q") @DefaultValue("") String filter);

}
