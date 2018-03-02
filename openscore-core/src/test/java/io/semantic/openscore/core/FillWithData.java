package io.semantic.openscore.core;

import io.semantic.openscore.core.api.competiciones.CrearDefinicionCompeticionDTO;
import io.semantic.openscore.core.services.api.DefinicionCompeticionesService;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyClientBuilder;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.junit.Ignore;
import org.junit.Test;

@Ignore
public class FillWithData {

    private static final String TARGET = "http://localhost:8080/openscore/api/rest";

    @Test
    public void doYourStuffs() {
        DefinicionCompeticionesService definicionCompeticionesService = proxy(DefinicionCompeticionesService.class);
        definicionCompeticionesService.getAll(0,
                0);
    }

    @Test
    public void addCompeticion() {
        DefinicionCompeticionesService definicionCompeticionesService = proxy(DefinicionCompeticionesService.class);
        CrearDefinicionCompeticionDTO competicionApi = new CrearDefinicionCompeticionDTO();
        competicionApi.setNombre("Libertadores de America");
        competicionApi.setDescripcion("La Champions League de America");
        definicionCompeticionesService.add(competicionApi);
    }

    private <T> T proxy(Class<T> clazz) {
        ResteasyClient client = new ResteasyClientBuilder().build();
        ResteasyWebTarget target = client.target(TARGET);
        return target.proxy(clazz);
    }
}
