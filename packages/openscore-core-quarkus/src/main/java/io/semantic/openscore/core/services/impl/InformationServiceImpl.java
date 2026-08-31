package io.semantic.openscore.core.services.impl;

import static io.semantic.openscore.core.services.RestUtil.ok;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.information.Information;
import io.semantic.openscore.core.exceptions.NoSePuedeLeerInformacionException;
import io.semantic.openscore.core.services.api.InformationService;

@ApplicationScoped
public class InformationServiceImpl implements InformationService {

    @Inject
    private EntityManager entityManager;

    @Override
    public ApiResponse<Information> getInformation() {
        try {
            Map<String, Object> emfProperties = entityManager.getEntityManagerFactory().getProperties();

            Map<String, Object> hibernateMap = emfProperties.entrySet().stream()
                    .filter(x -> x.getKey().startsWith("hibernate"))
                    .collect(Collectors.toMap(x -> x.getKey(), x -> x.getValue()));

            Properties prop = new Properties();
            String filename = "info.properties";
            InputStream input = getClass().getClassLoader().getResourceAsStream(filename);
            prop.load(input);
            Information information = new Information();
            information.setVersion(prop.getProperty("info.version"));
            information.setEnvironment(prop.getProperty("info.environment"));
            information.setProperties(hibernateMap);
            return ok(information);
        } catch (IOException e) {
            throw new NoSePuedeLeerInformacionException("No se puede leer info.properties", e);
        }
    }

    @Override
    public ApiResponse<String> securePing() {
        return ok("ok");
    }
}
