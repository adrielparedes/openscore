package io.semantic.openscore.core.model;

import javax.persistence.Entity;
import java.util.Date;

@Entity
public class Partido extends Storable {

    private Equipo local;
    private Equipo visitante;
    private Date fecha;
    private String lugar;

}
