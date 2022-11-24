package io.semantic.openscore.core.repository.startup.steps;

import java.text.MessageFormat;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;

@ApplicationScoped
public class CrearEquipos implements StartupStep {

    private EquiposRepository equiposRepository;

    // private String baseUrl =
    // "https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-3/";
    // private String baseUrl = "https://www.countryflags.io/{0}/flat/64.png";
    private String baseUrl = "https://restcountries.eu/data/{0}.svg";

    public CrearEquipos() {
    }

    @Inject
    public CrearEquipos(EquiposRepository equiposRepository) {
        this.equiposRepository = equiposRepository;
    }

    @Override
    public void run() {

        // GRUPO A
        this.crearEquipoSiNoExiste("BRA", "Brasil");
        this.crearEquipoSiNoExiste("BOL", "Bolivia");
        this.crearEquipoSiNoExiste("VEN", "Venezuela");
        this.crearEquipoSiNoExiste("PER", "Peru");

        // GRUPO B
        this.crearEquipoSiNoExiste("ARG", "Argentina");
        this.crearEquipoSiNoExiste("COL", "Colombia");
        this.crearEquipoSiNoExiste("PRY", "Paraguay");
        this.crearEquipoSiNoExiste("QAT", "Qatar");

        // GRUPO C
        this.crearEquipoSiNoExiste("URY", "Uruguay");
        this.crearEquipoSiNoExiste("ECU", "Ecuador");
        this.crearEquipoSiNoExiste("JPN", "Japan");
        this.crearEquipoSiNoExiste("CHL", "Chile");
    }

    private String getLogo(String codigo) {
        return MessageFormat.format(baseUrl, codigo.toLowerCase());
    }

    private void crearEquipoSiNoExiste(String codigo, String nombre) {
        if (!this.equiposRepository.exist(codigo)) {
            Equipo equipo = new Equipo(codigo, nombre, this.getLogo(codigo).toLowerCase());
            this.equiposRepository.save(equipo);
        }
    }

    @Override
    public int priority() {
        return 1000;
    }
}
