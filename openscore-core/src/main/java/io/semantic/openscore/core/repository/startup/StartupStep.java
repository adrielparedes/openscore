package io.semantic.openscore.core.repository.startup;

public interface StartupStep {

    void run();

    int priority();

    default boolean enabled() {
        return true;
    }
}
