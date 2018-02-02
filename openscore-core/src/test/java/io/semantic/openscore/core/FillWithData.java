package io.semantic.openscore.core;

import io.semantic.openscore.core.api.competiciones.CrearCompeticionApi;
import io.semantic.openscore.core.services.CompeticionesService;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

@Disabled
public class FillWithData {

    private static final String TARGET = "http://localhost:8080/openscore/api/rest";

    @Test
    public void doYourStuffs() {
        CompeticionesService competicionesService = proxy(CompeticionesService.class);
        competicionesService.getCompeticiones(0,
                                              0);
    }

    @Test
    public void addCompeticion() {
        CompeticionesService competicionesService = proxy(CompeticionesService.class);
        CrearCompeticionApi competicionApi = new CrearCompeticionApi();
        competicionApi.setNombre("Libertadores de America");
        competicionApi.setDescripcion("La Champions League de America");
        competicionesService.addCompeticion(competicionApi);
    }

    private <T> T proxy(Class<T> clazz) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(TARGET);
        return target.proxy(clazz);
    }
}
