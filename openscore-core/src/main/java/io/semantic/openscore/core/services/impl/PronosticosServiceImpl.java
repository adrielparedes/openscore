package io.semantic.openscore.core.services.impl;

import static io.semantic.openscore.core.services.RestUtil.ok;

import java.text.MessageFormat;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.pronosticos.CrearPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PartidoPronosticoDTO;
import io.semantic.openscore.core.api.pronosticos.PronosticoDTO;
import io.semantic.openscore.core.exceptions.PartidoBloqueadoException;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.mapping.PronosticoMapper;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.model.Pronostico;
import io.semantic.openscore.core.model.Usuario;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.PronosticoRepository;
import io.semantic.openscore.core.repository.UsuarioRepository;
import io.semantic.openscore.core.security.Secure;
import io.semantic.openscore.core.services.UserInfo;
import io.semantic.openscore.core.services.api.PronosticosService;
import io.semantic.openscore.core.validation.ApplicationValidator;

@ApplicationScoped
public class PronosticosServiceImpl implements PronosticosService {

    private Logger logger = LoggerFactory.getLogger(PronosticosServiceImpl.class);

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
            String fase,
            long dia,
            int fecha) {

        List<Partido> partidos = getPartidos(grupo, dia, fase, fecha);

        List<Pronostico> pronosticos = this.pronosticoRepository.findByUsuario(userInfo.getUserId());

        logger.info("Pronosticos encontrados para el usuario {}: {}", this.userInfo.getUsuario().get().getEmail(),
                pronosticos.size());

        List<PartidoPronosticoDTO> partidoDTOs = this.pronosticoMapper.asApiPronostico(partidos);

        for (PartidoPronosticoDTO partido : partidoDTOs) {
            if (partido.getResultado() != null) {
                logger.info("The Object {}", partido.getResultado().isPenales());
            }
        }

        partidoDTOs.forEach(partidoPronosticoDTO -> {
            pronosticos.forEach(pronostico -> {
                if (partidoPronosticoDTO.getId() == pronostico.getPartido().getId()) {
                    partidoPronosticoDTO.setPronostico(this.pronosticoMapper.asApi(pronostico));
                }
            });
        });

        return ok(partidoDTOs);
    }

    private List<Partido> getPartidos(String grupo, long dia, String fase, int fecha) {
        if (grupo != null && !grupo.isEmpty()) {
            return this.partidoRepository.findAllByGrupo(grupo);
        } else if (fase != null && !fase.isEmpty()) {
            return this.partidoRepository.findAllByFase(fase);
        } else if (fecha > 0) {
            return this.partidoRepository.findAllByFecha(fecha);
        } else if (dia > 0) {
            return this.partidoRepository.findAllByDia(dia);
        } else {
            return this.partidoRepository.findAll();
        }
    }

    @Override
    @Secure
    public ApiResponse<PartidoPronosticoDTO> get(long id) {
        long idUsuario = this.userInfo.getUserId();
        Pronostico pronostico = getPronosticoByPartido(id,
                idUsuario);

        PartidoPronosticoDTO dto = this.pronosticoMapper.asApiPronostico(pronostico.getPartido());
        dto.setPronostico(this.pronosticoMapper.asApi(pronostico));

        return ok(dto);
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
        long idUsuario = this.userInfo.getUserId();
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

    private Pronostico getPronosticoByPartido(long id,
            long idUsuario) {
        return this.pronosticoRepository
                .findByPartidoAndUsuario(id,
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
    @Transactional
    public ApiResponse<PartidoPronosticoDTO> local(long idPartido) {
        verificarSiElPartidoEstaBloqueado(idPartido);
        long idUsuario = this.userInfo.getUserId();
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.local();
        pronostico.setUsuario(this.userInfo.getUsuario().get());
        this.pronosticoRepository.save(pronostico);

        PartidoPronosticoDTO dto = this.pronosticoMapper.asApiPronostico(pronostico.getPartido());
        dto.setPronostico(this.pronosticoMapper.asApi(pronostico));

        return ok(dto);

    }

    private void verificarSiElPartidoEstaBloqueado(long idPartido) {
        Partido partido = this.getPartido(idPartido);
        if (partido.isBloqueado()) {
            throw new PartidoBloqueadoException(partido.getLocal().getCodigo(), partido.getVisitante().getCodigo());
        }
    }

    @Override
    @Transactional
    public ApiResponse<PartidoPronosticoDTO> empate(long idPartido) {
        verificarSiElPartidoEstaBloqueado(idPartido);
        long idUsuario = this.userInfo.getUserId();
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.empate();
        pronostico.setUsuario(this.userInfo.getUsuario().get());
        this.pronosticoRepository.save(pronostico);
        PartidoPronosticoDTO dto = this.pronosticoMapper.asApiPronostico(pronostico.getPartido());
        dto.setPronostico(this.pronosticoMapper.asApi(pronostico));

        return ok(dto);
    }

    @Override
    @Transactional
    public ApiResponse<PartidoPronosticoDTO> visitante(long idPartido) {
        verificarSiElPartidoEstaBloqueado(idPartido);
        long idUsuario = this.userInfo.getUserId();
        Pronostico pronostico = this.getPronosticoOrCreatePronostico(idPartido,
                idUsuario);
        pronostico.visitante();
        pronostico.setUsuario(this.userInfo.getUsuario().get());
        this.pronosticoRepository.save(pronostico);
        PartidoPronosticoDTO dto = this.pronosticoMapper.asApiPronostico(pronostico.getPartido());
        dto.setPronostico(this.pronosticoMapper.asApi(pronostico));

        return ok(dto);
    }

    private Pronostico getPronosticoOrCreatePronostico(long idPartido,
            long idUsuario) {
        return this.pronosticoRepository.findByPartidoAndUsuario(idPartido,
                idUsuario).orElseGet(() -> {
                    Pronostico pronostico = new Pronostico();
                    Partido partido = getPartido(idPartido);
                    pronostico.setPartido(partido);
                    Usuario usuario = getUsuario(idUsuario);
                    usuario.addPronostico(pronostico);

                    this.pronosticoRepository.save(pronostico);
                    this.usuarioRepository.save(usuario);
                    return pronostico;
                });
    }
}
