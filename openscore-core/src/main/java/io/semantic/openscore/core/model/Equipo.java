package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class Equipo extends Storable {

    private String nombre;
    private String codigo;
    private String logo;

    public Equipo() {
    }

    public Equipo(String codigo, String nombre, String logo) {
        this.nombre = nombre;
        this.codigo = codigo;
        this.logo = logo;
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

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

}
