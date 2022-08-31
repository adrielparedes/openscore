package io.semantic.openscore.core.model;

import javax.persistence.Entity;

@Entity
public class PreguntaSecreta extends Storable {

    private String codigo;
    private String pregunta;


    public String getPregunta() {
        return pregunta;
    }

    public void setPregunta(String pregunta) {
        this.pregunta = pregunta;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

}
