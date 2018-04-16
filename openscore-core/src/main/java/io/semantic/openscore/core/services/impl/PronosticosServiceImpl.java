package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.mapping.PronosticoMapper;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Pronostico;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.PronosticoRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.services.UserInfo;
import io.semantic.openscore.core.services.api.PronosticosService;
import io.semantic.openscore.core.validation.ApplicationValidator;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class PronosticosServiceImpl implements PronosticosService {

    private UserInfo userInfo;
    private PronosticoRepository pronosticoRepository;
    private PartidoRepository partidoRepository;
    private UsuarioRepository usuarioRepository;
    private ApplicationValidator validator;
    private PartidoMapper partidoMapper;
    private PronosticoMapper pronosticoMapper;

    public PronosticosServiceImpl() {
    }

    @Inject
    public PronosticosServiceImpl(UserInfo userInfo,
                                  PronosticoRepository pronosticoRepository,
                                  PartidoRepository partidoRepository,
                                  UsuarioRepository usuarioRepository,
                                  ApplicationValidator validator,
                                  PartidoMapper partidoMapper,
                                  PronosticoMapper pronosticoMapper) {
        this.userInfo = userInfo;
        this.pronosticoRepository = pronosticoRepository;
        this.partidoRepository = partidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.validator = validator;
        this.partidoMapper = partidoMapper;
        this.pronosticoMapper = pronosticoMapper;
    }

    @Override
    public ApiResponse<List<PartidoPronosticoDTO>> getAll(int page,
                                                          int pageSize,
                                                          String grupo,
                                                          String fecha) {

        List<Partido> partidos = getPartidos(grupo, fecha);
        List<Pronostico> pronosticos = this.pronosticoRepository.findByUsuario(userInfo.getUserId());


        List<PartidoPronosticoDTO> partidoDTOs = this.pronosticoMapper.asApiPronostico(partidos);

        partidoDTOs.forEach(partidoPronosticoDTO -> {
            pronosticos.forEach(pronostico -> {
                if (partidoPronosticoDTO.getId() == pronostico.getPartido().getId()) {
                    partidoPronosticoDTO.setPronostico(this.pronosticoMapper.asApi(pronostico));
                }
            });
        });


        return ok(partidoDTOs);
    }

    private List<Partido> getPartidos(String grupo, String fecha) {
        if (grupo != null && !grupo.isEmpty()) {
            return this.partidoRepository.findAllByGrupo(grupo);
        } else if (fecha != null && !fecha.isEmpty()) {
            Date date = getDate(fecha);
            return this.partidoRepository.findAllByFecha(date);
        } else {
            return this.partidoRepository.findAll();
        }
    }

    private Date getDate(String fecha) {
        try {
            return new SimpleDateFormat("yyyyMMdd").parse(fecha);
        } catch (ParseException e) {
            throw new IllegalArgumentException("El formato de la fecha es incorrecto", e);
        }
    }

    @Override
    public ApiResponse<PronosticoDTO> get(long id) {
        long idUsuario = 0l;
        Pronostico pronostico = getPronostico(id,
                idUsuario);
        return ok(this.pronosticoMapper.asApi(pronostico));
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        this.pronosticoRepository.deleteById(id);
        return ok(id);
    }

    @Override
    public ApiResponse<PronosticoDTO> add(CrearPronosticoDTO entity) {
        throw new UnsupportedOperationException("La operacion ADD para PronosticoService no esta soportada");
    }

    @Override
    public ApiResponse<PronosticoDTO> update(long id,
                                             CrearPronosticoDTO entity) {
        long idUsuario = 0l;
        validator.validate(entity);

        Pronostico pronostico = this.getPronostico(id,
                idUsuario);
        this.pronosticoMapper.updatePronostico(entity,
                pronostico);
        this.pronosticoRepository.save(pronostico);
        return ok(this.pronosticoMapper.asApi(pronostico));
    }

    private Usuario getUsuario(long idUsuario) {
        return this.usuarioRepository.findById(idUsuario).orElseThrow(() -> new IllegalArgumentException(MessageFormat
                .format("El Usuario con ID {0} no fue encontrado",
                        idUsuario)));
    }

    private Pronostico getPronostico(long id,
                                     long idUsuario) {
        return this.pronosticoRepository
                .findById(id,
                        idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat
                        .format("El Pronostico con ID {0} no se encuentra para el usuario {1}",
                                id,
                                idUsuario)));
    }

    private Partido getPartido(long id) {
        return this.partidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat
                        .format("El Partido con ID {0} no fue encontrado",
                                id)));
    }

    @Override
    public ApiResponse<PronosticoDTO> local(long idPartido) {
        long idUsuario = 0;
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.local();
        this.pronosticoRepository.save(pronostico);
        return ok(this.pronosticoMapper.asApi(pronostico));
    }

    @Override
    public ApiResponse<PronosticoDTO> empate(long idPartido) {
        long idUsuario = 0;
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.empate();
        this.pronosticoRepository.save(pronostico);
        return ok(this.pronosticoMapper.asApi(pronostico));
    }

    @Override
    public ApiResponse<PronosticoDTO> visitante(long idPartido) {
        long idUsuario = 0;
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.visitante();
        this.pronosticoRepository.save(pronostico);
        return ok(this.pronosticoMapper.asApi(pronostico));
    }

    private Pronostico getPronosticoOrCreatePronostico(long idPartido,
                                                       long idUsuario) {
        return this.pronosticoRepository.findByPartidoAndUsuario(idPartido,
                idUsuario).orElseGet(() -> {
            Pronostico pronostico = new Pronostico();
            Partido partido = getPartido(idPartido);
            pronostico.setPartido(partido);
            this.pronosticoRepository.save(pronostico);

            Usuario usuario = getUsuario(idUsuario);
            usuario.addPronostico(pronostico);
            this.usuarioRepository.save(usuario);
            return pronostico;
        });
    }
}
