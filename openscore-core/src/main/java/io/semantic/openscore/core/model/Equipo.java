package io.semantic.openscore.core.model;

import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.ManyToOne;

public class Equipo {

    @NotEmpty
    private String nombre;

    @ManyToOne
    private Pais pais;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Pais getPais() {
        return pais;
    }

    public void setPais(Pais pais) {
        this.pais = pais;
    }
}
