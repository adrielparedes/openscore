package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.GrupoRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class CrearGruposYFases implements StartupStep {

    private GrupoRepository grupoRepository;
    private FaseRepository faseRepository;

    public CrearGruposYFases() {

    }

    @Inject
    public CrearGruposYFases(GrupoRepository grupoRepository,
                             FaseRepository faseRepository) {

        this.grupoRepository = grupoRepository;
        this.faseRepository = faseRepository;
    }

    @Override
    public void run() {
        this.crearEtapaSiNoExiste(Fase.GRUPO, this.crearFase(Fase.GRUPO, "Group", 1));
        this.crearEtapaSiNoExiste(Fase.OCTAVOS, this.crearFase(Fase.OCTAVOS, "Eighth Finals", 2));
        this.crearEtapaSiNoExiste(Fase.CUARTOS, this.crearFase(Fase.CUARTOS, "Quarter Finals", 3));
        this.crearEtapaSiNoExiste(Fase.SEMI, this.crearFase(Fase.SEMI, "Semifinal", 4));
        this.crearEtapaSiNoExiste(Fase.TERCER, this.crearFase(Fase.TERCER, "Third Place", 4));
        this.crearEtapaSiNoExiste(Fase.FINAL, this.crearFase(Fase.FINAL, "Final", 4));

        this.crearGrupoSiNoExiste(Grupo.GRUPO_A, this.crearGrupo(Grupo.GRUPO_A, "Group A"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_B, this.crearGrupo(Grupo.GRUPO_B, "Group B"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_C, this.crearGrupo(Grupo.GRUPO_C, "Group C"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_D, this.crearGrupo(Grupo.GRUPO_D, "Group D"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_E, this.crearGrupo(Grupo.GRUPO_E, "Group E"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_F, this.crearGrupo(Grupo.GRUPO_F, "Group F"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_G, this.crearGrupo(Grupo.GRUPO_G, "Group G"));
        this.crearGrupoSiNoExiste(Grupo.GRUPO_H, this.crearGrupo(Grupo.GRUPO_H, "Grou H"));
        this.crearGrupoSiNoExiste(Grupo.NONE, this.crearGrupo(Grupo.NONE, "None"));

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

    private Fase crearFase(String codigo, String nombre, int puntos) {
        Fase fase = new Fase();
        fase.setCodigo(codigo.toUpperCase());
        fase.setNombre(nombre);
        fase.setPuntos(puntos);
        return fase;
    }
}
