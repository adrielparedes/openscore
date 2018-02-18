package io.semantic.openscore.core.api.equipos;

import io.semantic.openscore.core.api.paises.PaisApi;

public class EquipoApi {

    private long id;
    private String nombre;
    private String codigo;
    private PaisApi pais;
    private String logo;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public PaisApi getPais() {
        return pais;
    }

    public void setPais(PaisApi pais) {
        this.pais = pais;
    }
}
