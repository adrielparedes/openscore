package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.usuarios.CrearUsuarioDTO;
import io.semantic.openscore.core.exceptions.ValidationException;
import io.semantic.openscore.core.mapping.PaisMapper;
import io.semantic.openscore.core.mapping.UsuarioMapper;
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
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import javax.validation.Validation;

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
                Mappers.getMapper(UsuarioMapper.class),
                Mappers.getMapper(PaisMapper.class));
        when(paisRepository.findByCodigo(eq(pais.getCodigo()))).thenReturn(pais);
    }

    @Test
    public void testSeGuardaUnUsuarioCorrecto() {
        CrearUsuarioDTO crearUsuarioDTO = new CrearUsuarioDTO();
        crearUsuarioDTO.setApellido(APELLIDO);
        crearUsuarioDTO.setNombre(NOMBRE);
        crearUsuarioDTO.setEmail(EMAIL);
        crearUsuarioDTO.setConfirmacionEmail(EMAIL);
        crearUsuarioDTO.setPassword(PASSWORD);
        crearUsuarioDTO.setConfirmacionPassword(PASSWORD);
        crearUsuarioDTO.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioDTO);
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
        CrearUsuarioDTO crearUsuarioDTO = new CrearUsuarioDTO();
        crearUsuarioDTO.setApellido(APELLIDO);
        crearUsuarioDTO.setNombre(NOMBRE);
        crearUsuarioDTO.setEmail(EMAIL);
        crearUsuarioDTO.setConfirmacionEmail(EMAIL + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioDTO.setPassword(PASSWORD);
        crearUsuarioDTO.setConfirmacionPassword(PASSWORD);
        crearUsuarioDTO.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioDTO);
    }

    @Test(expected = ValidationException.class)
    public void testProblemaAlConfirmarPassword() {
        CrearUsuarioDTO crearUsuarioDTO = new CrearUsuarioDTO();
        crearUsuarioDTO.setApellido(APELLIDO);
        crearUsuarioDTO.setNombre(NOMBRE);
        crearUsuarioDTO.setEmail(EMAIL);
        crearUsuarioDTO.setConfirmacionEmail(EMAIL);
        crearUsuarioDTO.setPassword(PASSWORD);
        crearUsuarioDTO.setConfirmacionPassword(PASSWORD + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioDTO.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioDTO);
    }

    @Test(expected = ValidationException.class)
    public void testProblemaAlValidarUsuarioNoNulo() {
        CrearUsuarioDTO crearUsuarioDTO = new CrearUsuarioDTO();
        crearUsuarioDTO.setApellido(APELLIDO);
        crearUsuarioDTO.setNombre("");
        crearUsuarioDTO.setEmail(EMAIL);
        crearUsuarioDTO.setConfirmacionEmail(EMAIL);
        crearUsuarioDTO.setPassword(PASSWORD);
        crearUsuarioDTO.setConfirmacionPassword(PASSWORD + "IMPOSIBLE_CONFIRMAR");
        crearUsuarioDTO.setPais(PAIS);
        this.usuariosService.registrarUsuario(crearUsuarioDTO);
    }

}