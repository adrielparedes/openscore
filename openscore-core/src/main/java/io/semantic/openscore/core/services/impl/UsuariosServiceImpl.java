package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.TokenDTO;
import io.semantic.openscore.core.api.usuarios.*;
import io.semantic.openscore.core.cache.TokenCache;
import io.semantic.openscore.core.email.MailFactory;
import io.semantic.openscore.core.email.MailServer;
import io.semantic.openscore.core.logging.ServiceLogger;
import io.semantic.openscore.core.mapping.PaisMapper;
import io.semantic.openscore.core.mapping.UsuarioMapper;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.services.UserInfo;
import io.semantic.openscore.core.services.api.UsuariosService;
import io.semantic.openscore.core.validation.ApplicationValidator;
import io.semantic.openscore.core.validation.validators.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.ws.rs.Path;
import java.text.MessageFormat;
import java.util.*;
import java.util.stream.StreamSupport;

import static io.semantic.openscore.core.services.RestUtil.ok;
import static java.util.stream.Collectors.toList;

@Path("/usuarios")
@RequestScoped
public class UsuariosServiceImpl implements UsuariosService {

    private UserInfo userInfo;
    private TokenCache tokenCache;
    private MailServer mailSender;
    private MailFactory mailFactory;
    private List<EmailValidator> mailValidators;
    private ServiceLogger serviceLogger;
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
                               ApplicationValidator appValidator,
                               UsuarioMapper mapper,
                               PaisMapper paisMapper,
                               UserInfo userInfo,
                               TokenCache tokenCache,
                               MailServer mailSender,
                               MailFactory mailFactory,
                               Instance<EmailValidator> mailValidators,
                               ServiceLogger serviceLogger) {
        this.usuarioRepository = usuarioRepository;
        this.paisRepository = paisRepository;
        this.tokenGenerator = tokenGenerator;
        this.validator = appValidator;
        this.mapper = mapper;
        this.paisMapper = paisMapper;
        this.userInfo = userInfo;
        this.tokenCache = tokenCache;
        this.mailSender = mailSender;
        this.mailFactory = mailFactory;
        this.mailValidators = StreamSupport.stream(mailValidators.spliterator(), false).collect(toList());

        this.serviceLogger = serviceLogger;
    }


    @Override
    public ApiResponse<UsuarioDTO> registrarUsuario(CrearUsuarioDTO crearUsuario) {
        return new ApiResponse<>(this.saveUser(crearUsuario));
    }

    @Override
    public ApiResponse<TokenDTO> updateUsuario(long id, UpdateUsuarioDTO crearUsuario) {
        if (this.userInfo.getUserId() == id) {
            return new ApiResponse<>(new TokenDTO(this.tokenGenerator.generarToken(this.updateUser(id, crearUsuario))));
        } else {
            throw new IllegalArgumentException("You are trying to modify an user that is not you");
        }
    }

    private Usuario updateUser(long id, UpdateUsuarioDTO updateUsuario) {
        this.validator.validate(updateUsuario);
        Usuario usuario = this.findUsuario(id);
        Pais pais = this.paisRepository.findByCodigo(updateUsuario.getPais());
        this.mapper.updateUsuario(updateUsuario, usuario);
        usuario.setPais(pais);
        this.usuarioRepository.save(usuario);
        return usuario;
    }


    @Override
    public ApiResponse<UsuarioDTO> recoverPassword(RecoverPassword updatePassword) {
        this.validator.validate(updatePassword);

        this.tokenCache.getToken(updatePassword.getEmail())
                .map(x -> x.equals(updatePassword.getToken()))
                .orElseThrow(() -> new IllegalArgumentException("No token was found to update password. Please try again"));

        Usuario user = this.usuarioRepository.findByEmail(updatePassword.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat.format("User not found with email {0}. Please try again",
                        updatePassword.getEmail())));

        user.setPassword(this.tokenGenerator.generarPassword(updatePassword.getPassword()));
        this.usuarioRepository.save(user);
        this.tokenCache.remove(user.getEmail());
        return ok(this.mapper.asApi(user));
    }

    @Override
    public ApiResponse<String> sendToken(String email) {
        if (!this.usuarioRepository.exist(email)) {
            throw new IllegalArgumentException(MessageFormat.format("User with email {0} does not exist in OpenScore", email));
        }
        String token = this.tokenGenerator.generateRandomToken();
        this.tokenCache.add(email, token);
        Map<String, Object> params = new HashMap<>();
        params.put("email", email);
        params.put("token", token);
        this.mailSender.send(this.mailFactory.getRecoverPasswordEmail(email, token));
        return ok("");
    }

    @Override
    public ApiResponse<UsuarioDTO> updatePassword(UpdatePassword updatePassword) {
        this.validator.validate(updatePassword);
        long userId = this.userInfo.getUserId();

        Usuario usuario = this.usuarioRepository.findById(userId).orElseThrow(() ->
                new IllegalArgumentException("User is not logged in"));

        if (usuario.getPassword().equals(this.tokenGenerator.generarPassword(updatePassword.getOldPassword()))) {
            usuario.setPassword(this.tokenGenerator.generarPassword(updatePassword.getPassword()));
            this.usuarioRepository.save(usuario);
        } else {
            throw new IllegalArgumentException("Old password does not match");
        }

        return ok(this.mapper.asApi(usuario));
    }


    private UsuarioDTO saveUser(CrearUsuarioDTO crearUsuario) {
        this.validator.validate(crearUsuario);
        Pais pais = this.paisRepository.findByCodigo(crearUsuario.getPais());
        Usuario usuario = this.mapper.asUsuario(crearUsuario);
        usuario.setPassword(this.tokenGenerator.generarPassword(crearUsuario.getPassword()));
        usuario.setRoles(new HashSet<>(Arrays.asList(Rol.USUARIO)));
        usuario.setPais(pais);
        this.usuarioRepository.save(usuario);

        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);
        usuarioDTO.setPais(this.paisMapper.asApi(pais));

        return usuarioDTO;
    }

    @Override
    @Secure
    public ApiResponse<String> deleteUsuario(long id) {
        return null;
    }

    @Override
    public ApiResponse<UsuarioDTO> getUsuario(Long id) {
        Usuario usuario = findUsuario(id);
        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);
        return new ApiResponse<UsuarioDTO>(usuarioDTO);
    }

    private Usuario findUsuario(Long id) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findById(id);
        return usuarioOptional.orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public ApiResponse<UsuarioDTO> getMiUsuario() {
        return this.getUsuario(this.userInfo.getUserId());
    }

    public Usuario getUsuario(String email) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findByEmail(email);
        return usuarioOptional.orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    public ApiResponse<TokenDTO> login(LoginUsuarioDTO loginUsuario) {
        Optional<Usuario> usuarioOptional = this.usuarioRepository.findByEmail(loginUsuario.getEmail().trim());
        Usuario usuario = usuarioOptional.orElseThrow(() -> new IllegalArgumentException("User or password not found"));

        TokenGenerator tokenGenerator = new TokenGenerator();

        checkPassword(loginUsuario.getPassword(), usuario, tokenGenerator);

        UsuarioDTO usuarioDTO = this.mapper.asApi(usuario);

        TokenDTO tokenDTO = new TokenDTO(tokenGenerator.generarToken(usuario));

        return new ApiResponse<>(tokenDTO);
    }

    private void checkPassword(String password, Usuario usuario, TokenGenerator tokenGenerator) {
        if (!usuario.getPassword().equals(tokenGenerator.generarPassword(password)))
            throw new IllegalArgumentException("Invalid password");
    }

    @Override
    public ApiResponse<List<UsuarioDTO>> getAll(int page, int pageSize, String filter) {
        List<Usuario> usuarios = this.usuarioRepository.findAll(new Page(page, pageSize));
        List<UsuarioDTO> usuariosApi = this.mapper.asApi(usuarios);
        return new ApiResponse<>(usuariosApi);
    }
}
