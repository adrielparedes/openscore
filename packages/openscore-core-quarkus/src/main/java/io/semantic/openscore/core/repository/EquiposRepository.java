package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Equipo;

import javax.enterprise.context.RequestScoped;
import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

@RequestScoped
public class EquiposRepository extends Repository<Equipo> {

    public static final String FIND_BY_CODIGO = "select p from Equipo p where p.codigo = :codigo";

    public EquiposRepository() {
        super(Equipo.class);
    }

    public boolean exist(String codigo) {
        TypedQuery<Equipo> query = this.createQuery(FIND_BY_CODIGO);
        query.setParameter("codigo", codigo);
        return this.findByQuery(query).size() > 0;
    }

    public Optional<Equipo> findByCodigo(String codigo) {
        TypedQuery<Equipo> query = this.createQuery(FIND_BY_CODIGO);
        query.setParameter("codigo", codigo);
        List<Equipo> found = this.findByQuery(query);
        if (found.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(found.get(0));
        }
    }

    @Override
    public boolean exist(Equipo entity) {
        return false;
    }
}
