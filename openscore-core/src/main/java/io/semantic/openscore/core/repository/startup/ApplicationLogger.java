package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.logger.CoreLogger;

import java.text.MessageFormat;

public class ApplicationLogger extends CoreLogger {

    public void inicializandoPaises() {
        this.getLogger().info("Inicializando Paises");
    }

    public void inicializacionDePaisesCompleta() {
        this.getLogger().info("Inicializacion de Paises completa");
    }

    public void seCreaElPaisNoExistente(String nombre) {
        this.getLogger().info(MessageFormat.format("No existe '{0}', creando pais", nombre));
    }
}
