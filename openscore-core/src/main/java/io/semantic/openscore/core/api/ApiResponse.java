package io.semantic.openscore.core.api;

public class ApiResponse<T> {

    private String error;
    private String description;
    private T data;

    public ApiResponse() {
    }

    public ApiResponse(T data) {
        this.data = data;
    }

    public ApiResponse(String error,
                       String description,
                       T data) {
        this(data);
        this.description = description;
        this.error = error;
    }

    public String getDescription() {
        return description;
    }

    public String getError() {
        return error;
    }

    public T getData() {
        return data;
    }
}
