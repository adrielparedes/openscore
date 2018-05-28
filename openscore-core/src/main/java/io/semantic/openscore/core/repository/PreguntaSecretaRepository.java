package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.PreguntaSecreta;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@Stateless
public class PreguntaSecretaRepository extends Repository<PreguntaSecreta> {


    private static final String FIND_ENTITY_BY_CODIGO_QUERY = "select p from PreguntaSecreta p where p.codigo = :codigo";


    public PreguntaSecretaRepository() {
        super(PreguntaSecreta.class);
    }

    public boolean exist(String codigo) {
        return this.findByCodigo(codigo).isPresent();
    }

    public Optional<PreguntaSecreta> findByCodigo(String codigo) {
        TypedQuery<PreguntaSecreta> query = this.createQuery(FIND_ENTITY_BY_CODIGO_QUERY);
        query.setParameter("codigo", codigo);
        List<PreguntaSecreta> results = query.getResultList();
        if (results.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(results.get(0));
        }
    }
}
