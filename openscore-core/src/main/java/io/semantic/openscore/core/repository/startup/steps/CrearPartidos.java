package io.semantic.openscore.core.repository.startup.steps;

import io.semantic.openscore.core.repository.EquiposRepository;
import io.semantic.openscore.core.repository.PartidoRepository;
import io.semantic.openscore.core.repository.startup.StartupStep;

import java.time.Month;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class CrearPartidos implements StartupStep {


    private final PartidoRepository partidoRepository;
    private final EquiposRepository equiposRepository;

    public CrearPartidos(PartidoRepository partidoRepository,
                         EquiposRepository equiposRepository) {

        this.partidoRepository = partidoRepository;
        this.equiposRepository = equiposRepository;
    }

    @Override
    public void run() {


//        this.crearPartidoSiNoExiste("RUS", "KSR", getMatchDate(14, Month.JUNE, 18, 00, "UTC+3"), "Estadio Luzhnikí - Moscú");

    }

    private void crearPartidoSiNoExiste(String rus, String ksr, Date matchDate, String s) {
    }

    private Date getMatchDate(int dia, Month mes, int hora, int minutos, String timeZone) {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
        calendar.set(2018, Month.JUNE.getValue(), 14, 18, 00);
        return calendar.getTime();
    }

    @Override
    public int priority() {
        return 2000;
    }
}
