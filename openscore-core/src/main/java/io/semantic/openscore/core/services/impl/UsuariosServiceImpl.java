package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.annotations.Mapper;
import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.paises.PaisApi;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioApi;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioApi;
import io.semantic.openscore.core.api.usuarios.UsuarioApi;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.services.api.UsuariosService;
import io.semantic.openscore.core.validation.ApplicationValidator;
import org.dozer.DozerBeanMapper;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Path("/usuarios")
@RequestScoped
public class UsuariosServiceImpl implements UsuariosService {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;
    private TokenGenerator tokenGenerator;
    private ApplicationValidator validator;
    private DozerBeanMapper mapper;

    public UsuariosServiceImpl() {
    }


    @Inject
    public UsuariosServiceImpl(UsuarioRepository usuarioRepository,
                               PaisRepository paisRepository,
                               TokenGenerator tokenGenerator,
                               ApplicationValidator validator,
                               @Mapper DozerBeanMapper mapper) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
        this.validator = validator;
        this.mapper = mapper;
    }


    @Override
    public ApiResponse<UsuarioApi> registrarUsuario(CrearUsuarioApi crearUsuario) {

        this.validator.validate(crearUsuario);

        Pais pais = this.paisRepository.findByCodigo(crearUsuario.getPais());

        Usuario usuario = mapper.map(crearUsuario, Usuario.class);
        usuario.setPais(pais);
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.USUARIO)));
        usuario.setPassword(this.tokenGenerator.generarPassword(crearUsuario.getPassword()));

        this.usuarioRepository.save(usuario);

        UsuarioApi usuarioApi = this.mapper.map(usuario, UsuarioApi.class);
        usuarioApi.setPais(this.mapper.map(pais, PaisApi.class));

        return new ApiResponse<>(usuarioApi);
    }

    @Override
    public ApiResponse<String> deleteUsuario(long id) {
        return null;
    }

    @Override
    public ApiResponse<String> getUsuario(long id) {
        return null;
    }

    @Override
    public ApiResponse<UsuarioApi> login(LoginUsuarioApi loginUsuario) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findByEmail(loginUsuario.getEmail());
        UsuarioApi usuarioApi = this.mapper.map(usuarioOptional.get(), UsuarioApi.class);
        return new ApiResponse<>(usuarioApi);
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
