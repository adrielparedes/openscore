package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.Equipo;
import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;

import javax.inject.Inject;

public class CrearEquipos implements StartupStep {


    private EquiposRepository equiposRepository;

    private String baseUrl = "https://fsprdcdnpublic.azureedge.net/global-pictures/flags-fwc2018-3/";

    public CrearEquipos() {
    }

    @Inject
    public CrearEquipos(EquiposRepository equiposRepository) {
        this.equiposRepository = equiposRepository;
    }

    @Override
    public void run() {

        // GRUPO A
        this.crearEquipoSiNoExiste("RUS", "Russia");
        this.crearEquipoSiNoExiste("KSA", "Saudi Arabia");
        this.crearEquipoSiNoExiste("EGY", "Egypt");
        this.crearEquipoSiNoExiste("URU", "Uruguay");

        // GRUPO B
        this.crearEquipoSiNoExiste("POR", "Portugal");
        this.crearEquipoSiNoExiste("ESP", "Spain");
        this.crearEquipoSiNoExiste("MAR", "Morocco");
        this.crearEquipoSiNoExiste("IRN", "Iran");

        // GRUPO C
        this.crearEquipoSiNoExiste("FRA", "France");
        this.crearEquipoSiNoExiste("AUS", "Australia");
        this.crearEquipoSiNoExiste("PER", "Peru");
        this.crearEquipoSiNoExiste("DEN", "Denmark");

        // GRUPO D
        this.crearEquipoSiNoExiste("ARG", "Argentina");
        this.crearEquipoSiNoExiste("ISL", "Iceland");
        this.crearEquipoSiNoExiste("CRO", "Croatia");
        this.crearEquipoSiNoExiste("NGA", "Nigeria");

        // GRUPO E
        this.crearEquipoSiNoExiste("BRA", "Brazil");
        this.crearEquipoSiNoExiste("SUI", "Switzerland");
        this.crearEquipoSiNoExiste("CRC", "Costa Rica");
        this.crearEquipoSiNoExiste("SRB", "Serbia");

        // GRUPO F
        this.crearEquipoSiNoExiste("GER", "Germany");
        this.crearEquipoSiNoExiste("MEX", "Mexico");
        this.crearEquipoSiNoExiste("SWE", "Sweden");
        this.crearEquipoSiNoExiste("KOR", "South Korea");

        // GRUPO G
        this.crearEquipoSiNoExiste("BEL", "Belgium");
        this.crearEquipoSiNoExiste("PAN", "Panama");
        this.crearEquipoSiNoExiste("TUN", "Tunisia");
        this.crearEquipoSiNoExiste("ENG", "England");

        // GRUPO H
        this.crearEquipoSiNoExiste("POL", "Poland");
        this.crearEquipoSiNoExiste("SEN", "Senegal");
        this.crearEquipoSiNoExiste("COL", "Colombia");
        this.crearEquipoSiNoExiste("JPN", "Japan");
    }

    private String getLogo(String codigo) {
        return baseUrl + codigo.toLowerCase();
    }

    private void crearEquipoSiNoExiste(String codigo, String nombre) {
        if (!this.equiposRepository.exist(codigo)) {
            Equipo equipo = new Equipo(codigo, nombre, this.getLogo(codigo));
            this.equiposRepository.save(equipo);
        }
    }

    @Override
    public int priority() {
        return 1000;
    }
}
