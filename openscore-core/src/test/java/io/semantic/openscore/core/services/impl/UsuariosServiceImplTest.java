package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.usuarios.CrearUsuarioApi;
import io.semantic.openscore.core.exceptions.ValidationException;
import io.semantic.openscore.core.mapping.DozerProducer;
import io.semantic.openscore.core.model.Pais;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PaisRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.TokenGenerator;
import io.semantic.openscore.core.services.api.UsuariosService;
import io.semantic.openscore.core.validation.ApplicationValidator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.validation.Validation;
import javax.validation.Validator;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@RunWith(MockitoJUnitRunner.class)
public class UsuariosServiceImplTest {


    private static final String APELLIDO = "Hendrix";
    private static final String NOMBRE = "Jimi";
    private static final String EMAIL = "jimi@hendrix.com";
    private static final String PAIS = "ARG";
    private static final String PASSWORD = "1234!56";

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PaisRepository paisRepository;

    private UsuariosService usuariosService;

    @Captor
    private ArgumentCaptor<Usuario> usuarioCaptor;

    private Pais pais;

    private TokenGenerator tokenGenerator;

    @Before
    public void setUp() {

        tokenGenerator = new TokenGenerator();
        pais = new Pais("ARG", "Argentina");
        usuariosService = new UsuariosServiceImpl(usuarioRepository,
                paisRepository,
                tokenGenerator,
                new ApplicationValidator(Validation.buildDefaultValidatorFactory().getValidator()),
                new DozerProducer().produceDozer());
        when(paisRepository.findByCodigo(eq(pais.getCodigo()))).thenReturn(pais);
    }

    @Test
    public void testSeGuardaUnUsuarioCorrecto() {
        CrearUsuarioApi crearUsuarioApi = new CrearUsuarioApi();
        crearUsuarioApi.setApellido(APELLIDO);
        crearUsuarioApi.setNombre(NOMBRE);
        crearUsuarioApi.setEmail(EMAIL);
        crearUsuarioApi.setConfirmacionEmail(EMAIL);
        crearUsuarioApi.setPassword(PASSWORD);
        crearUsuarioApi.setConfirmacionPassword(PASSWORD);
        crearUsuarioApi.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioApi);
        verify(usuarioRepository, times(1)).save(usuarioCaptor.capture());

        assertEquals(NOMBRE, usuarioCaptor.getValue().getNombre());
        assertEquals(APELLIDO, usuarioCaptor.getValue().getApellido());
        assertEquals(EMAIL, usuarioCaptor.getValue().getEmail());
        assertEquals(this.tokenGenerator.generarPassword(PASSWORD), usuarioCaptor.getValue().getPassword());
        assertTrue(usuarioCaptor.getValue().getRoles().contains(Rol.USUARIO));
        assertEquals(new Pais(PAIS, "Argentina"), usuarioCaptor.getValue().getPais());

    }

    @Test(expected = ValidationException.class)
    public void testProblemaAlConfirmarEmail() {
        CrearUsuarioApi crearUsuarioApi = new CrearUsuarioApi();
        crearUsuarioApi.setApellido(APELLIDO);
        crearUsuarioApi.setNombre(NOMBRE);
        crearUsuarioApi.setEmail(EMAIL);
        crearUsuarioApi.setConfirmacionEmail(EMAIL + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioApi.setPassword(PASSWORD);
        crearUsuarioApi.setConfirmacionPassword(PASSWORD);
        crearUsuarioApi.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioApi);
    }

    @Test(expected = ValidationException.class)
    public void testProblemaAlConfirmarPassword() {
        CrearUsuarioApi crearUsuarioApi = new CrearUsuarioApi();
        crearUsuarioApi.setApellido(APELLIDO);
        crearUsuarioApi.setNombre(NOMBRE);
        crearUsuarioApi.setEmail(EMAIL);
        crearUsuarioApi.setConfirmacionEmail(EMAIL);
        crearUsuarioApi.setPassword(PASSWORD);
        crearUsuarioApi.setConfirmacionPassword(PASSWORD + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioApi.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioApi);
    }

    @Test(expected = ValidationException.class)
    public void testProblemaAlValidarUsuarioNoNulo() {
        CrearUsuarioApi crearUsuarioApi = new CrearUsuarioApi();
        crearUsuarioApi.setApellido(APELLIDO);
        crearUsuarioApi.setNombre("");
        crearUsuarioApi.setEmail(EMAIL);
        crearUsuarioApi.setConfirmacionEmail(EMAIL);
        crearUsuarioApi.setPassword(PASSWORD);
        crearUsuarioApi.setConfirmacionPassword(PASSWORD + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioApi.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioApi);
    }

}