package io.semantic.openscore.core.repository.startup.builder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.inject.Alternative;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

@Alternative
public class TestDiaBuilder implements DiaBuilder {

    private Logger logger = LoggerFactory.getLogger(TestDiaBuilder.class);
    private static final long ONE_MINUTE_IN_MILLIS = 60000;
    private Random random = new Random();

    public Date getMatchDate(String fecha) {
        Calendar date = Calendar.getInstance();
        long t = date.getTimeInMillis();
        Date afterAddingTenMins = new Date(t + (random.nextInt(8 * 60) * ONE_MINUTE_IN_MILLIS));
        logger.info(afterAddingTenMins.toString());
        return afterAddingTenMins;
    }
}
