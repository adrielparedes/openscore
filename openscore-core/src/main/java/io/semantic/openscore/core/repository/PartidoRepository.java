package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;

import javax.ejb.Stateless;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;
import java.util.Date;
import java.util.List;

@Stateless
public class PartidoRepository extends Repository<Partido> {

    private static final String EXIST = "select e from Partido e where " +
            "e.local.codigo = :local AND " +
            "e.visitante.codigo = :visitante AND " +
            "e.fase.id = :fase AND " +
            "e.grupo.id = :grupo";

    private static final String FIND_ALL_BY_GROUP = "from Partido where " +
            "grupo.codigo = :grupo " +
            "order by fecha asc";

    private static final String FIND_ALL_BY_FECHA = "from Partido where " +
            "day(fecha) = day(:fecha) AND " +
            "month(fecha) = month(:fecha) AND " +
            "year(fecha) = year(:fecha) " +
            "order by fecha asc";

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

    public List<Partido> findAllByGrupo(String grupo) {
        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_GROUP)
                .setParameter("grupo", grupo);
        return this.findByQuery(query);
    }

    public List<Partido> findAllByFecha(Date fecha) {
        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_FECHA)
                .setParameter("fecha", fecha, TemporalType.DATE);
        return this.findByQuery(query);
    }
}
