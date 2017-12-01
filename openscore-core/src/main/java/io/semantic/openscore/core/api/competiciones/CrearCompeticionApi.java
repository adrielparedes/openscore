package io.semantic.openscore.core.api.competiciones;

public class CrearCompeticionApi {

    private String nombre;
    private String logoId;
    private String copaId;
    private String descripcion;
    private String ubicacion;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getLogoId() {
        return logoId;
    }

    public void setLogoId(String logoId) {
        this.logoId = logoId;
    }

    public String getCopaId() {
        return copaId;
    }

    public void setCopaId(String copaId) {
        this.copaId = copaId;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }
}
