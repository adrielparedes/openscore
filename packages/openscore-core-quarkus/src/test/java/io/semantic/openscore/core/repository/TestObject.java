package io.semantic.openscore.core.repository;

import javax.persistence.Entity;

import io.semantic.openscore.core.model.Storable;

@Entity
public class TestObject extends Storable {

    private String name;

    public TestObject() {
    }

    public TestObject(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
