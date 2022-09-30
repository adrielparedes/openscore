package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

public interface GetService<T> extends SearchService<T> {


    @Path("/{id}")
    @GET
    ApiResponse<T> get(@PathParam("id") long id);

}
