package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;

@Stateless
public class PartidoRepository extends Repository<Partido> {

    private static final String EXIST = "select e from Partido e where " +
            "e.local.codigo = :local AND " +
            "e.visitante.codigo = :visitante AND " +
            "e.fase.id = :fase AND " +
            "e.grupo.id = :grupo";

    public PartidoRepository() {
        super(Partido.class);
    }

    public boolean exist(String codigoLocal, String codigoVisitante, Grupo grupo, Fase fase) {
        TypedQuery<Partido> query = this.createQuery(EXIST)
                .setParameter("local", codigoLocal)
                .setParameter("visitante", codigoVisitante)
                .setParameter("fase", fase.getId())
                .setParameter("grupo", grupo.getId());

        return this.findByQuery(query).size() > 0;
    }
}
