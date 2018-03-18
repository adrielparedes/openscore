package io.semantic.openscore.core.repository.startup;

import io.semantic.openscore.core.model.Etapa;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.repository.EtapaRepository;
import io.semantic.openscore.core.repository.GrupoRepository;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

public class CrearGruposYEtapas {

    private GrupoRepository grupoRepository;
    private EtapaRepository etapaRepository;

    public CrearGruposYEtapas() {

    }

    @Inject
    public CrearGruposYEtapas(GrupoRepository grupoRepository,
                              EtapaRepository etapaRepository) {

        this.grupoRepository = grupoRepository;
        this.etapaRepository = etapaRepository;
    }

    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object init) {
    }

    private Grupo crearGrupo(String codigo, String nombre) {
        return null;
    }

    private Etapa crearEtapa(String codigo, String nombre) {
        return null;
    }
}
