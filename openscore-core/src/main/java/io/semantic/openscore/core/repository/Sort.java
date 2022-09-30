package io.semantic.openscore.core.repository;

public enum Sort {
    ASC, DESC;

    @Override
    public String toString() {
        return super.toString().toLowerCase();
    }
}
