package io.semantic.openscore.core.exceptions;

import java.text.MessageFormat;

public class PartidoBloqueadoException extends ApplicationException {
    public PartidoBloqueadoException(String local, String visitante) {
        super(MessageFormat.format("El partido {0} - {1} se encuentra bloqueado", local, visitante));
    }
}
