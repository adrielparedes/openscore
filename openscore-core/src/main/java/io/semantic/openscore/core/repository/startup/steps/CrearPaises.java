package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;

public class CrearPaises implements StartupStep {


    Logger logger = LoggerFactory.getLogger(CrearPaises.class);
    private PaisRepository paisRepository;

    public CrearPaises() {
    }

    @Inject
    public CrearPaises(PaisRepository paisRepository) {
        this.paisRepository = paisRepository;
    }

    @Override
    public void run() {

        logger.info("Inicializando paises");

        this.guardarSiNoExiste("ARG", crearPais("ARG", "Argentina"));
        this.guardarSiNoExiste("CHI", crearPais("CHI", "Chile"));
        this.guardarSiNoExiste("PER", crearPais("PER", "Peru"));
        this.guardarSiNoExiste("COL", crearPais("COL", "Colombia"));
        this.guardarSiNoExiste("MEX", crearPais("MEX", "Mexico"));
        this.guardarSiNoExiste("BRA", crearPais("BRA", "Brazil"));

        logger.info("Inicial de paises completa");
    }

    @Override
    public int priority() {
        return 0;
    }

    public void guardarSiNoExiste(String codigo, Pais pais) {
        if (!this.paisRepository.exist(codigo)) {
            logger.info("Se crea pais no existente: " + codigo);
            this.paisRepository.save(pais);
        }
    }

    public Pais crearPais(String codigo, String nombre) {
        Pais pais = new Pais();
        pais.setCodigo(codigo);
        pais.setNombre(nombre);
        return pais;
    }


}
