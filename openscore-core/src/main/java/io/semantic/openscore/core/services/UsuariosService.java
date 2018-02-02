package io.semantic.openscore.core.services;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.Usuario;

public interface UsuariosService extends LuceneSearchService<Usuario> {


    ApiResponse<String> addUsuario();

    ApiResponse<String> deleteUsuario(long id);

    ApiResponse<String> getUsuario(long id);

}
