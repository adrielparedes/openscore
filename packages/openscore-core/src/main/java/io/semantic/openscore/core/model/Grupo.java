package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class Grupo extends Storable {

    public final static String GRUPO_A = "GRUPO_A";
    public final static String GRUPO_B = "GRUPO_B";
    public final static String GRUPO_C = "GRUPO_C";
    public final static String GRUPO_D = "GRUPO_D";
    public final static String GRUPO_E = "GRUPO_E";
    public final static String GRUPO_F = "GRUPO_F";
    public final static String GRUPO_G = "GRUPO_G";
    public final static String GRUPO_H = "GRUPO_H";
    public final static String NONE = "NONE";

    private String codigo;
    private String nombre;

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getNombre() {
        return nombre;
    }
}
