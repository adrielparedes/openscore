package io.semantic.openscore.core.api.pronosticos;

import io.semantic.openscore.core.model.Usuario;

import javax.persistence.ManyToOne;

public class PronosticoDTO {

    private long id;
    private boolean local;
    private boolean visitante;
    private boolean empate;

    @ManyToOne
    private Usuario usuario;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isLocal() {
        return local;
    }

    public void setLocal(boolean local) {
        this.local = local;
    }

    public boolean isVisitante() {
        return visitante;
    }

    public void setVisitante(boolean visitante) {
        this.visitante = visitante;
    }

    public boolean isEmpate() {
        return empate;
    }

    public void setEmpate(boolean empate) {
        this.empate = empate;
    }

}
