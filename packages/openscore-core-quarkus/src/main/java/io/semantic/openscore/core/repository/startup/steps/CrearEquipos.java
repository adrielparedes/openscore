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

        this.crearEquipoSiNoExiste("QAT", "Qatar");
        this.crearEquipoSiNoExiste("ECU", "Ecuador");
        this.crearEquipoSiNoExiste("SEN", "Senegal");
        this.crearEquipoSiNoExiste("NLD", "Netherlands");
        this.crearEquipoSiNoExiste("GB-ENG", "England");
        this.crearEquipoSiNoExiste("IRN", "Iran");
        this.crearEquipoSiNoExiste("GB-WLS", "Wales");
        this.crearEquipoSiNoExiste("ARG", "Argentina");
        this.crearEquipoSiNoExiste("SAU", "Saudi Arabia");
        this.crearEquipoSiNoExiste("MEX", "Mexico");
        this.crearEquipoSiNoExiste("POL", "Poland");
        this.crearEquipoSiNoExiste("FRA", "France");
        this.crearEquipoSiNoExiste("AUS", "Australia");
        this.crearEquipoSiNoExiste("DNK", "Denmark");
        this.crearEquipoSiNoExiste("TUN", "Tunisia");
        this.crearEquipoSiNoExiste("SPA", "Spain");
        this.crearEquipoSiNoExiste("CRI", "Costa Rica");
        this.crearEquipoSiNoExiste("GER", "Germany");
        this.crearEquipoSiNoExiste("JPN", "Japan");
        this.crearEquipoSiNoExiste("BEL", "Belgium");
        this.crearEquipoSiNoExiste("CAN", "Canada");
        this.crearEquipoSiNoExiste("MAR", "Morocco");
        this.crearEquipoSiNoExiste("HRV", "Croatia");
        this.crearEquipoSiNoExiste("BRA", "Brazil");
        this.crearEquipoSiNoExiste("SRB", "Serbia");
        this.crearEquipoSiNoExiste("CHE", "Switzerland");
        this.crearEquipoSiNoExiste("CMR", "Cameroon");
        this.crearEquipoSiNoExiste("POR", "Portugal");
        this.crearEquipoSiNoExiste("GHA", "Ghana");
        this.crearEquipoSiNoExiste("URY", "Uruguay");
        this.crearEquipoSiNoExiste("KOR", "South Korea");
        this.crearEquipoSiNoExiste("USA", "USA");
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
