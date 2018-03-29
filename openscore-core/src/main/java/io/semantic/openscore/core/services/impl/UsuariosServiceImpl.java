package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.TokenDTO;
import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.LoginUsuarioDTO;
import io.semantic.openscore.core.api.usuarios.UsuarioDTO;
import io.semantic.openscore.core.mapping.PaisMapper;
import io.semantic.openscore.core.mapping.UsuarioMapper;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.Admin;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.services.api.UsuariosService;
import io.semantic.openscore.core.validation.ApplicationValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Path("/usuarios")
@RequestScoped
public class UsuariosServiceImpl implements UsuariosService {

    private Logger logger = LoggerFactory.getLogger(UsuariosServiceImpl.class);

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
    @Secure
    @Admin
    public ApiResponse<String> deleteUsuario(long id) {
        return null;
    }

    @Override
    public ApiResponse<UsuarioDTO> getUsuario(Long id) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findById(id);
        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("Usuario inexistente"));
        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);
        return new ApiResponse<UsuarioDTO>(usuarioDTO);
    }

    @Override
    public ApiResponse<TokenDTO> login(LoginUsuarioDTO loginUsuario) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findByEmail(loginUsuario.getEmail());
        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("Usuario o password no encontrado"));

        TokenGenerator tokenGenerator = new TokenGenerator();

        logger.info("Usuario->password {}", usuario.getPassword());
        logger.info("LoginUsuario->password {}", tokenGenerator.generarPassword(loginUsuario.getPassword()));

        if (!usuario.getPassword().equals(tokenGenerator.generarPassword(loginUsuario.getPassword())))
            throw new IllegalArgumentException("Password invalido");

        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);

        TokenDTO tokenDTO = new TokenDTO(tokenGenerator.generarToken(usuario));

        return new ApiResponse<>(tokenDTO);
    }

    @Override
    public ApiResponse<List<UsuarioDTO>> getAll(int page, int pageSize, String filter) {
        List<Usuario> usuarios = this.usuarioRepository.findAll(new Page(page, pageSize));
        List<UsuarioDTO> usuariosApi = this.mapper.asApi(usuarios);
        return new ApiResponse<>(usuariosApi);
    }
}
