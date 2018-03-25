package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Resultado extends Storable {

    private int local;
    private int visitante;

    @OneToOne
    private Partido partido;

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

    public Ganador getGanador() {
        if (local > visitante) {
            return Ganador.LOCAL;
        } else if (local < visitante) {
            return Ganador.VISITANTE;
        } else {
            return Ganador.EMPATE;
        }
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }
}
