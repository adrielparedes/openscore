package io.semantic.openscore.core.services.impl;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.admin.UsuarioCompletoDTO;
import io.semantic.openscore.core.mapping.UsuarioMapper;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.services.api.AdminService;

@ApplicationScoped
public class AdminServiceImpl implements AdminService {

    private UsuarioMapper mapper;
    private UsuarioRepository usuarioRepository;

    public AdminServiceImpl() {
    }

    @Inject
    public AdminServiceImpl(UsuarioRepository usuarioRepository,
                            UsuarioMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @Override
    @Secure(Rol.ADMIN)
    public ApiResponse<List<UsuarioCompletoDTO>> getAll(int page, int pageSize, String filter) {
        List<Usuario> usuarios = this.usuarioRepository.findAll(new Page(page, pageSize));
        List<UsuarioCompletoDTO> usuariosApi = this.mapper.asCompletoApi(usuarios);
        return new ApiResponse<>(usuariosApi);
    }
}
