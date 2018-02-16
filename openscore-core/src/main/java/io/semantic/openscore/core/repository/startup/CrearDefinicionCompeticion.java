package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.model.DefinicionCompeticion;
import io.semantic.openscore.core.repository.CompeticionesRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class CrearDefinicionCompeticion {

    public static final String NOMBRE = "Copa del Mundo Rusia 2018";
    public static final String LOGO = "http://4.bp.blogspot.com/-mI8c_hLez24/VP3-XTk8dPI/AAAAAAAAIkc/fpi6SFOhuTM/s1600/logo%2Bmundial%2Brussia%2B2018%2Bvector%2Bai%2B(Large).jpg";
    Logger logger = LoggerFactory.getLogger(CrearPaises.class);
    private CompeticionesRepository competicionesRepository;

    public CrearDefinicionCompeticion() {
    }

    @Inject
    public CrearDefinicionCompeticion(CompeticionesRepository competicionesRepository) {
        this.competicionesRepository = competicionesRepository;
    }

    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object init) {

        logger.info("Inicializando competiciones");

        this.guardarSiNoExiste(NOMBRE, this.crearCompeticion());

        logger.info("Inicializacion de competiciones completa");
    }

    public void guardarSiNoExiste(String nombre, DefinicionCompeticion competicion) {
        if (!this.competicionesRepository.exist(nombre)) {
            logger.info("Se crea la competicion no existente: " + nombre);
            this.competicionesRepository.save(competicion);
        }
    }

    public DefinicionCompeticion crearCompeticion() {
        DefinicionCompeticion competicion = new DefinicionCompeticion();
        competicion.setNombre(NOMBRE);
        competicion.setLogo(LOGO);
        competicion.setDescripcion("Vamos la copa del mundo!");
        return competicion;
    }


}