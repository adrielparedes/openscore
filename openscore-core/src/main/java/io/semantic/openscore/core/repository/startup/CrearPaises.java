package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.repository.PaisRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

@ApplicationScoped
public class CrearPaises {


    Logger logger = LoggerFactory.getLogger(CrearPaises.class);
    private PaisRepository paisRepository;

    @Inject
    public CrearPaises(PaisRepository paisRepository) {
        this.paisRepository = paisRepository;
    }

    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object init) {
//        logger.inicializandoPaises();

        this.guardarSiNoExiste("ARG", crearPais("ARG", "Argentina"));
        this.guardarSiNoExiste("CHI", crearPais("CHI", "Chile"));
        this.guardarSiNoExiste("PER", crearPais("PER", "Peru"));
        this.guardarSiNoExiste("COL", crearPais("COL", "Colombia"));

//        logger.inicializacionDePaisesCompleta();
    }

    public void guardarSiNoExiste(String codigo, Pais pais) {
        if (this.paisRepository.exist(codigo)) {
//            logger.seCreaElPaisNoExistente(pais.getNombre());
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
