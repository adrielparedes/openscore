package io.semantic.openscore.core.repository;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;

@ApplicationScoped
public class TestRepository extends Repository<TestObject> {

    public TestRepository(EntityManager entityManager) {
        super(TestObject.class,
                entityManager);
    }

    @Override
    public boolean exist(TestObject entity) {
        return false;
    }

}
