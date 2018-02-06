package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Entity
public class Pais extends Storable {

    @NotNull
    private String nombre;

    @NotNull
    private String codigo;

    public Pais() {
    }

    public Pais(String codigo, String nombre) {
        this.setCodigo(codigo);
        this.setNombre(nombre);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof Pais) {
            return this.getCodigo().equals(((Pais) obj).getCodigo());
        } else {
            return super.equals(obj);
        }
    }

}
