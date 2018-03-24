package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class CrearGruposYEtapas implements StartupStep {

    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;

    public CrearGruposYEtapas() {

    }

    @Inject
    public CrearGruposYEtapas(GrupoRepository grupoRepository,
                              FaseRepository faseRepository) {

        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
    }

    @Override
    public void run() {
        this.crearEtapaSiNoExiste("GRUPO", this.crearFase("GRUPO", "Grupo"));
        this.crearEtapaSiNoExiste("OCTAVOS", this.crearFase("OCTAVOS", "Octavos de Final"));
        this.crearEtapaSiNoExiste("CUARTOS", this.crearFase("CUARTOS", "Cuartos de Final"));
        this.crearEtapaSiNoExiste("SEMI", this.crearFase("SEMI", "Semifinal"));
        this.crearEtapaSiNoExiste("FINAL", this.crearFase("FINAL", "Final"));

        this.crearGrupoSiNoExiste("GRUPO_A", this.crearGrupo("GRUPO_A", "Grupo A"));
        this.crearGrupoSiNoExiste("GRUPO_B", this.crearGrupo("GRUPO_B", "Grupo B"));
        this.crearGrupoSiNoExiste("GRUPO_C", this.crearGrupo("GRUPO_C", "Grupo C"));
        this.crearGrupoSiNoExiste("GRUPO_D", this.crearGrupo("GRUPO_D", "Grupo D"));
        this.crearGrupoSiNoExiste("GRUPO_E", this.crearGrupo("GRUPO_E", "Grupo E"));
        this.crearGrupoSiNoExiste("GRUPO_F", this.crearGrupo("GRUPO_F", "Grupo F"));
        this.crearGrupoSiNoExiste("GRUPO_G", this.crearGrupo("GRUPO_G", "Grupo G"));
        this.crearGrupoSiNoExiste("GRUPO_H", this.crearGrupo("GRUPO_H", "Grupo H"));

    }

    @Override
    public int priority() {
        return 0;
    }

    private void crearGrupoSiNoExiste(String codigo, Grupo grupo) {
        if (!this.grupoRepository.exist(codigo)) {
            this.grupoRepository.save(grupo);
        }
    }

    private void crearEtapaSiNoExiste(String codigo, Fase estapa) {
        if (!this.faseRepository.exist(codigo)) {
            this.faseRepository.save(estapa);
        }
    }

    private Grupo crearGrupo(String codigo, String nombre) {
        Grupo grupo = new Grupo();
        grupo.setCodigo(codigo);
        grupo.setNombre(nombre);
        return grupo;
    }

    private Fase crearFase(String codigo, String nombre) {
        Fase fase = new Fase();
        fase.setCodigo(codigo);
        fase.setNombre(nombre);
        return fase;
    }
}
