package io.semantic.openscore.core.services.api;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import io.semantic.openscore.core.api.ApiResponse;

public interface StandardService<X, Y, Z> {

    @Path("/{id}")
    @GET
    ApiResponse<X> get(@PathParam("id") long id);

    @Path("/{id}")
    @DELETE
    ApiResponse<Long> delete(@PathParam("id") long id);

    @Path("/")
    @POST
    ApiResponse<X> add(Y entity);

    @Path("/{id}")
    @POST
    ApiResponse<X> update(@PathParam("id") long id,
            Z entity);

}
