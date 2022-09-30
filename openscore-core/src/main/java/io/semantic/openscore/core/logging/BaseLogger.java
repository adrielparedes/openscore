package io.semantic.openscore.core.logging;


import org.slf4j.Logger;

public abstract class BaseLogger {

    private Logger logger;

    public BaseLogger(Logger logger) {
        this.logger = logger;
    }

    public boolean isDebugEnabled() {
        return this.getLogger().isDebugEnabled();
    }


    protected Logger getLogger() {
        return this.logger;
    }


}
