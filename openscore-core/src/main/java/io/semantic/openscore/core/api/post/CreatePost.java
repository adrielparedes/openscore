package io.semantic.openscore.core.api.post;

public class CreatePost {

    private String titulo;
    private String content;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getContenido() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
