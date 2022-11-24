package io.semantic.openscore.core.repository.startup.steps;

public class PreguntaSecretaData {
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

    @Override
    public String toString() {
        return getCodigo() + " - " + getPregunta();
    }
}
