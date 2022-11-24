package io.semantic.openscore.core.services.impl;

import static io.semantic.openscore.core.services.RestUtil.ok;

import java.text.MessageFormat;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.repository.FaseRepository;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.services.api.FasesService;

@ApplicationScoped
public class FasesServiceImpl implements FasesService {

    private FaseRepository faseRepository;

    public FasesServiceImpl() {
    }

    @Inject
    public FasesServiceImpl(FaseRepository faseRepository) {
        this.faseRepository = faseRepository;
    }

    @Override
    public ApiResponse<List<Fase>> getAll(int page, int pageSize, String filter) {
        return ok(this.faseRepository.findAll(new Page(page, pageSize)));
    }

    @Override
    public ApiResponse<Fase> get(long id) {
        return ok(this.faseRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        MessageFormat
                                .format("La Fase con el ID {0} no fue encontrada", id))));
    }
}
