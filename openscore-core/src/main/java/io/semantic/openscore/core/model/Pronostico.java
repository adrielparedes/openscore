package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.IndexedEmbedded;

@Entity
public class Pronostico extends Storable {

    private boolean local;
    private boolean visitante;
    private boolean empate;

    @ManyToOne
    private Partido partido;

    @ManyToOne
    private Usuario usuario;

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

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public void local() {
        this.setLocal(true);
        this.setVisitante(false);
        this.setEmpate(false);
    }

    public void empate() {
        this.setLocal(false);
        this.setVisitante(false);
        this.setEmpate(true);
    }

    public void visitante() {
        this.setLocal(false);
        this.setVisitante(true);
        this.setEmpate(false);
    }

    public int getPuntos() {
        return this.getPartido().getPuntos(this);
    }
}
