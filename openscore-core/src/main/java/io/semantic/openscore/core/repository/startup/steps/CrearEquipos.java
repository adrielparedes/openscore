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
        this.crearEquipoSiNoExiste("RUS", "Rusia");
        this.crearEquipoSiNoExiste("KSA", "Arabia Saudita");
        this.crearEquipoSiNoExiste("EGY", "Egipto");
        this.crearEquipoSiNoExiste("URU", "Uruguay");

        // GRUPO B
        this.crearEquipoSiNoExiste("POR", "Portugal");
        this.crearEquipoSiNoExiste("ESP", "España");
        this.crearEquipoSiNoExiste("MAR", "Marruecos");
        this.crearEquipoSiNoExiste("IRN", "Iran");

        // GRUPO C
        this.crearEquipoSiNoExiste("FRA", "Francia");
        this.crearEquipoSiNoExiste("AUS", "Australia");
        this.crearEquipoSiNoExiste("PER", "Peru");
        this.crearEquipoSiNoExiste("DEN", "Dinamarca");

        // GRUPO D
        this.crearEquipoSiNoExiste("ARG", "Argentina");
        this.crearEquipoSiNoExiste("ISL", "Islandia");
        this.crearEquipoSiNoExiste("CRO", "Croacia");
        this.crearEquipoSiNoExiste("NGA", "Nigeria");

        // GRUPO E
        this.crearEquipoSiNoExiste("BRA", "Brasil");
        this.crearEquipoSiNoExiste("SUI", "Suiza");
        this.crearEquipoSiNoExiste("CRC", "Costa Rica");
        this.crearEquipoSiNoExiste("SRB", "Serbia");

        // GRUPO F
        this.crearEquipoSiNoExiste("GER", "Alemania");
        this.crearEquipoSiNoExiste("MEX", "Mexico");
        this.crearEquipoSiNoExiste("SWE", "Suecia");
        this.crearEquipoSiNoExiste("KOR", "Corea del Sur");

        // GRUPO G
        this.crearEquipoSiNoExiste("BEL", "Belgica");
        this.crearEquipoSiNoExiste("PAN", "Panama");
        this.crearEquipoSiNoExiste("TUN", "Tunez");
        this.crearEquipoSiNoExiste("ENG", "Inglaterra");

        // GRUPO H
        this.crearEquipoSiNoExiste("POL", "Polonia");
        this.crearEquipoSiNoExiste("SEN", "Senegal");
        this.crearEquipoSiNoExiste("COL", "Colombia");
        this.crearEquipoSiNoExiste("JPN", "Japon");
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
