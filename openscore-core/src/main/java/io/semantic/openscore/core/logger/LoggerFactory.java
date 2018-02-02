package io.semantic.openscore.core.logger;

import org.slf4j.Logger;

public class LoggerFactory {

    public static <X, Y extends CoreLogger> Y get(Class<Y> coreLogger, Class<X> clazz) {
        Logger logger = org.slf4j.LoggerFactory.getLogger(clazz);
        Y instance = createInstance(coreLogger);
        instance.setLogger(logger);
        return instance;
    }

    private static <T extends CoreLogger> T createInstance(Class<T> coreLogger) {
        try {
            T instance = coreLogger.newInstance();
            return instance;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
