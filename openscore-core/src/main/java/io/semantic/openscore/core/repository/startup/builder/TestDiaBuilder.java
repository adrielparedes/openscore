package io.semantic.openscore.core.repository.startup.builder;

import java.time.LocalDateTime;
import java.util.Random;

import javax.enterprise.inject.Alternative;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Alternative
public class TestDiaBuilder implements DiaBuilder {

    private Logger logger = LoggerFactory.getLogger(TestDiaBuilder.class);
    private static final long ONE_MINUTE_IN_MILLIS = 60000;
    private Random random = new Random();

    public LocalDateTime getMatchDate(String fecha) {
        // Calendar date = Calendar.getInstance();
        // long t = date.getTimeInMillis();
        // Date afterAddingTenMins = new Date(t + (random.nextInt(8 * 60) *
        // ONE_MINUTE_IN_MILLIS));
        // logger.info(afterAddingTenMins.toString());
        // return afterAddingTenMins;
        return null;
    }

    @Override
    public LocalDateTime epochToDate(long date) {
        // TODO Auto-generated method stub
        return null;
    }
}
