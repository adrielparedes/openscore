package io.semantic.openscore.core.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.OneToOne;

@Embeddable
public class Resultado {

    @Column(nullable = true)
    private int local;

    @Column(nullable = true)
    private int visitante;

    @Column(nullable = true)
    private boolean penales;

    @Column(nullable = true)
    private int penalesLocal;

    @Column(nullable = true)
    private int penalesVisitante;

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

        if (penales) {
            if (penalesLocal > penalesVisitante) {
                return Ganador.LOCAL;
            } else if (penalesLocal < penalesVisitante) {
                return Ganador.VISITANTE;
            } else {
                return Ganador.EMPATE;
            }
        } else {
            if (local > visitante) {
                return Ganador.LOCAL;
            } else if (local < visitante) {
                return Ganador.VISITANTE;
            } else {
                return Ganador.EMPATE;
            }
        }
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public int getPenalesLocal() {
        return penalesLocal;
    }

    public void setPenalesLocal(int penalesLocal) {
        this.penalesLocal = penalesLocal;
    }

    public int getPenalesVisitante() {
        return penalesVisitante;
    }

    public void setPenalesVisitante(int penalesVisitante) {
        this.penalesVisitante = penalesVisitante;
    }

    public boolean isPenales() {
        return penales;
    }

    public void setPenales(boolean penales) {
        this.penales = penales;
    }
}
