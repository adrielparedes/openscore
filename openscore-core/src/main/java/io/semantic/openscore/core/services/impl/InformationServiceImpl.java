package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.information.Information;
import io.semantic.openscore.core.exceptions.NoSePuedeLeerInformacionException;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.services.api.InformationService;

import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class InformationServiceImpl implements InformationService {

    @PersistenceContext(unitName = "db")
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
    @Secure({Rol.ADMIN, Rol.USUARIO})
    public ApiResponse<String> securePing() {
        return ok("ok");
    }
}
