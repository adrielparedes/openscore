package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

@Entity
public class Pais extends Storable {

    @NotNull
    private String nombre;

    @NotNull
    private String codigo;

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
}
