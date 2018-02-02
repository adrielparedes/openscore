package io.semantic.openscore.core.services;

import io.semantic.openscore.core.api.ApiResponse;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import java.util.List;

public interface LuceneSearchService<T> {

    @GET
    @Path("/")
    ApiResponse<List<T>> getAll(@QueryParam("page") @DefaultValue("1") int page,
                                @QueryParam("pageSize") @DefaultValue("10") int pageSize,
                                @QueryParam("q") @DefaultValue("") String filter);

}
