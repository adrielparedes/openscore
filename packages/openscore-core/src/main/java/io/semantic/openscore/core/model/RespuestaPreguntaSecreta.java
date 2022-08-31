package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class RespuestaPreguntaSecreta extends Storable {

    @ManyToOne
    private PreguntaSecreta preguntaSecreta;

    private String respuesta;

    public PreguntaSecreta getPreguntaSecreta() {
        return preguntaSecreta;
    }

    public void setPreguntaSecreta(PreguntaSecreta preguntaSecreta) {
        this.preguntaSecreta = preguntaSecreta;
    }

    public String getRespuesta() {
        return respuesta;
    }

    public void setRespuesta(String respuesta) {
        this.respuesta = respuesta;
    }
}
