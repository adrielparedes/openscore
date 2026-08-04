package io.semantic.openscore.core.services.api;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.ranking.Ranking;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("ranking")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface RankingService {

    @GET
    @Path("/{id}")
    ApiResponse<Ranking> getRanking(@PathParam("id") long id);

    @GET
    @Path("/")
    ApiResponse<List<Ranking>> getAllRanking(@QueryParam("pais") String pais, @QueryParam("size") @DefaultValue("0") int size);


}
