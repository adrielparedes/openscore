package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class PreguntaSecreta extends Storable {

    public static final String PRODUCTO_REDHAT_FAVORITO = "PRODUCTO_REDHAT_FAVORITO";
    public static final String MOMBRE_MASCOTA = "MOMBRE_MASCOTA";
    public static final String SEGUNDO_NOMBRE_PADRE = "SEGUNDO_NOMBRE_PADRE";
    public static final String SEGUNDO_NOMBRE_MADRE = "SEGUNDO_NOMBRE_MADRE";
    public static final String EQUIPO_FAVORITO = "EQUIPO_FAVORITO";
    public static final String LENGUAJE_PROGRAMACION_FAVORITO = "LENGUAJE_PROGRAMACION_FAVORITO";
    public static final String PELICULA_FAVORITA = "PELICULA_FAVORITA";
    public static final String BANDA_FAVORITA = "BANDA_FAVORITA";


    private String codigo;
    private String pregunta;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }
}
