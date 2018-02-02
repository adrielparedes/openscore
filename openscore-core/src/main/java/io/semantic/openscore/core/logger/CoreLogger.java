package io.semantic.openscore.core.logger;

import org.slf4j.Logger;

public abstract class CoreLogger {

    private Logger logger;

    protected void setLogger(Logger logger) {
        this.logger = logger;
    }

    protected Logger getLogger() {
        return this.logger;
    }
}
