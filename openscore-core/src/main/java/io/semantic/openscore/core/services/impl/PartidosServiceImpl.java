package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.partidos.CrearOUpdatePartidoDTO;
import io.semantic.openscore.core.api.partidos.PartidoDTO;
import io.semantic.openscore.core.mapping.PartidoMapper;
import io.semantic.openscore.core.model.Partido;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.services.api.PartidosService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class PartidosServiceImpl implements PartidosService {


    private PartidoRepository partidoRepository;
    private PartidoMapper partidoMapper;

    public PartidosServiceImpl() {
    }

    @Inject
    public PartidosServiceImpl(final PartidoRepository partidoRepository,
                               final PartidoMapper partidoMapper) {
        this.partidoRepository = partidoRepository;
        this.partidoMapper = partidoMapper;
    }

    @Override
    public ApiResponse<List<PartidoDTO>> getAll(int page,
                                                int pageSize,
                                                String grupo,
                                                String fase,
                                                long fecha,
                                                String equipo) {

        this.partidoRepository.findAll();
        List<Partido> partidos = this.partidoRepository.findAll();
        return ok(this.partidoMapper.asApi(partidos));
    }


    @Override
    public ApiResponse<PartidoDTO> get(long id) {
        return null;
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        return null;
    }

    @Override
    public ApiResponse<PartidoDTO> add(CrearOUpdatePartidoDTO entity) {
        return null;
    }

    @Override
    public ApiResponse<PartidoDTO> update(long id, CrearOUpdatePartidoDTO entity) {
        return null;
    }
}
