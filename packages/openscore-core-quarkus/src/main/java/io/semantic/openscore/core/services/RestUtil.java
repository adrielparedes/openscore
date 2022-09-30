package io.semantic.openscore.core.services;

import io.semantic.openscore.core.api.ApiResponse;

public class RestUtil {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(data);
    }

    public static ApiResponse<Object> error(String error,
                                            String description,
                                            Object data) {
        return new ApiResponse<>(error,
                                 description,
                                 data);
    }
}
