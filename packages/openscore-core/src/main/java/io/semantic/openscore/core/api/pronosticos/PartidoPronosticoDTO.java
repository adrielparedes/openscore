package io.semantic.openscore.core.api.pronosticos;

import io.semantic.openscore.core.api.partidos.PartidoDTO;

public class PartidoPronosticoDTO extends PartidoDTO {

    private PronosticoDTO pronostico;

    public PronosticoDTO getPronostico() {
        return pronostico;
    }

    public void setPronostico(PronosticoDTO pronostico) {
        this.pronostico = pronostico;
    }
}
