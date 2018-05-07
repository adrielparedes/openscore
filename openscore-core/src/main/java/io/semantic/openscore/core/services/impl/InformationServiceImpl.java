package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.information.Information;
import io.semantic.openscore.core.exceptions.NoSePuedeLeerInformacionException;
import io.semantic.openscore.core.services.api.InformationService;

import javax.enterprise.context.RequestScoped;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class InformationServiceImpl implements InformationService {

    @Override
    public ApiResponse<Information> getInformation() {
        try {
            Properties prop = new Properties();
            String filename = "info.properties";
            InputStream input = getClass().getClassLoader().getResourceAsStream(filename);
            prop.load(input);
            Information information = new Information();
            information.setVersion(prop.getProperty("info.version"));
            information.setEnvironment(prop.getProperty("info.environment"));
            return ok(information);
        } catch (IOException e) {
            throw new NoSePuedeLeerInformacionException("No se puede leer info.properties", e);
        }
    }
}
