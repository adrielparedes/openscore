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
            "order by dia asc";

    private static final String FIND_ALL_BY_FASE = "from Partido where " +
            "fase.codigo = :fase " +
            "order by dia asc";

    private static final String FIND_ALL_BY_FECHA = "from Partido where " +
            "fecha = :fecha " +
            "order by dia asc";

    private static final String FIND_ALL_BY_DIA = "from Partido where " +
            "cast(dia as date) = :dia " +
            "order by dia asc";

    private static final String FIND_ALL_FECHAS = "select distinct p.fecha from Partido p group by p.fecha order by p.fecha asc";


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

    public List<Partido> findAllByDia(Date dia) {
        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_DIA)
                .setParameter("dia", dia,TemporalType.DATE);
        return this.findByQuery(query);
    }

    public List<Partido> findAllByFase(String fase) {
        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_FASE)
                .setParameter("fase", fase);
        return this.findByQuery(query);
    }

    public List<Partido> findAllByFecha(int fecha) {
        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_FECHA)
                .setParameter("fecha", fecha);
        return this.findByQuery(query);
    }

    public List<Integer> findAllFechas() {
        return this.entityManager.createQuery(FIND_ALL_FECHAS).getResultList();
    }
}
