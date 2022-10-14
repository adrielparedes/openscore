package io.semantic.openscore.core.api.partidos;

public class ResultadoDTO {

    private int local;
    private int visitante;
    private boolean penales;
    private int penalesLocal;
    private int penalesVisitante;

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

    public boolean isPenales() {
        return penales;
    }

    public void setPenales(boolean penales) {
        this.penales = penales;
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
}
