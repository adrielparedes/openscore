package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class Resultado extends Storable {

    private Partido partido;
    private int local;
    private int visitante;

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public int getLocal() {
        return local;
    }

    public void setLocal(int local) {
        this.local = local;
    }

    public int getVisitante() {
        return visitante;
    }

    public void setVisitante(int visitante) {
        this.visitante = visitante;
    }
}
