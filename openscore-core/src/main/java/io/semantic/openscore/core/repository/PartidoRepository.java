package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Fase;
import io.semantic.openscore.core.model.Grupo;
import io.semantic.openscore.core.model.Partido;

import javax.ejb.Stateless;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;

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
            "cast(dia as date) BETWEEN :dia1 AND :dia2  " +
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

    public List<Partido> findAllByDia(long dia) {

        Calendar dia1 = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        dia1.setTimeInMillis(dia);
        dia1.set(Calendar.HOUR, 6);
        dia1.set(Calendar.MINUTE, 0);

        Calendar dia2 = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        dia2.setTimeInMillis(dia);
        dia2.set(Calendar.HOUR, 6);
        dia2.set(Calendar.MINUTE, 0);
        dia2.add(Calendar.DATE, 1);
        


        TypedQuery<Partido> query = this.createQuery(FIND_ALL_BY_DIA)
                .setParameter("dia1", dia1, TemporalType.DATE)
                .setParameter("dia2", dia2, TemporalType.DATE);
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

    @Override
    public boolean exist(Partido entity) {
        return this.exist(entity.getLocal().getCodigo(),
                entity.getVisitante().getCodigo(),
                entity.getGrupo(),
                entity.getFase());
    }
}
