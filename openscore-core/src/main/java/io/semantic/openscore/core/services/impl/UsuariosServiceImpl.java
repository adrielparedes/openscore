package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioApi;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.mapping.PaisMapper;
import io.semantic.openscore.core.mapping.UsuarioMapper;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.services.api.UsuariosService;
import io.semantic.openscore.core.validation.ApplicationValidator;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Path("/usuarios")
@RequestScoped
public class UsuariosServiceImpl implements UsuariosService {

    private UsuarioRepository usuarioRepository;
    private PaisRepository paisRepository;
    private TokenGenerator tokenGenerator;
    private ApplicationValidator validator;
    private UsuarioMapper mapper;
    private PaisMapper paisMapper;

    public UsuariosServiceImpl() {
    }


    @Inject
    public UsuariosServiceImpl(UsuarioRepository usuarioRepository,
                               PaisRepository paisRepository,
                               TokenGenerator tokenGenerator,
                               ApplicationValidator validator,
                               UsuarioMapper mapper,
                               PaisMapper paisMapper) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
        this.validator = validator;
        this.mapper = mapper;
        this.paisMapper = paisMapper;
    }


    @Override
    public ApiResponse<UsuarioDTO> registrarUsuario(CrearUsuarioDTO crearUsuario) {

        this.validator.validate(crearUsuario);

        Pais pais = this.paisRepository.findByCodigo(crearUsuario.getPais());

        Usuario usuario = mapper.asUsuario(crearUsuario);
        usuario.setPais(pais);
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.USUARIO)));
        usuario.setPassword(this.tokenGenerator.generarPassword(crearUsuario.getPassword()));

        this.usuarioRepository.save(usuario);

        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);
        usuarioDTO.setPais(this.paisMapper.asApi(pais));

        return new ApiResponse<>(usuarioDTO);
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
    public ApiResponse<UsuarioDTO> login(LoginUsuarioApi loginUsuario) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findByEmail(loginUsuario.getEmail());
        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("Usuario o password no encontrado"));
        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);
        return new ApiResponse<>(usuarioDTO);
    }

    @Override
    public ApiResponse<List<UsuarioDTO>> getAll(int page, int pageSize, String filter) {
        List<Usuario> usuarios = this.usuarioRepository.findAll(new Page(page, pageSize));
        List<UsuarioDTO> usuariosApi = this.mapper.asApi(usuarios);
        return new ApiResponse<>(usuariosApi);
    }
}
