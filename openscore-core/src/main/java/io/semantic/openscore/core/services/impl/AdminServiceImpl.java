package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.annotations.Mapper;
import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.admin.UsuarioApi;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.api.AdminService;
import org.dozer.DozerBeanMapper;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.util.List;
import java.util.stream.Collectors;

@RequestScoped
public class AdminServiceImpl implements AdminService {

    private UsuarioRepository usuarioRepository;
    private DozerBeanMapper mapper;

    public AdminServiceImpl() {
    }

    @Inject
    public AdminServiceImpl(UsuarioRepository usuarioRepository,
                            @Mapper DozerBeanMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.mapper = mapper;
    }

    @Override
    public ApiResponse<List<UsuarioApi>> getAll(int page, int pageSize, String filter) {
        List<Usuario> usuarios = this.usuarioRepository.findAll(new Page(page, pageSize));
        List<UsuarioApi> usuariosApi = usuarios
                .stream()
                .map(usuario -> this.mapper.map(usuario, UsuarioApi.class))
                .collect(Collectors.toList());
        return new ApiResponse<>(usuariosApi);
    }
}
