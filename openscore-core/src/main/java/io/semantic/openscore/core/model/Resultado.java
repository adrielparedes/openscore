package io.semantic.openscore.core.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.OneToOne;

@Embeddable
public class Resultado {

    @Column(nullable = true)
    private Integer local;

    @Column(nullable = true)
    private Integer visitante;

    @Column(nullable = true)
    private boolean penales;

    @Column(nullable = true)
    private Integer penalesLocal;

    @Column(nullable = true)
    private Integer penalesVisitante;

    @OneToOne
    private Partido partido;

    public Integer getLocal() {
        return local;
    }

    public void setLocal(Integer local) {
        this.local = local;
    }

    public Integer getVisitante() {
        return visitante;
    }

    public void setVisitante(Integer visitante) {
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

    public Integer getPenalesLocal() {
        return penalesLocal;
    }

    public void setPenalesLocal(Integer penalesLocal) {
        this.penalesLocal = penalesLocal;
    }

    public Integer getPenalesVisitante() {
        return penalesVisitante;
    }

    public void setPenalesVisitante(Integer penalesVisitante) {
        this.penalesVisitante = penalesVisitante;
    }

    public boolean isPenales() {
        return penales;
    }

    public void setPenales(boolean penales) {
        this.penales = penales;
    }
}
