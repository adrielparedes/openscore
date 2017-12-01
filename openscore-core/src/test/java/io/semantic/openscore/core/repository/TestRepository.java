package io.semantic.openscore.core.repository;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;

@Stateless
public class TestRepository extends Repository<TestObject> {

    public TestRepository(EntityManager entityManager) {
        super(TestObject.class,
              entityManager);
    }
}
