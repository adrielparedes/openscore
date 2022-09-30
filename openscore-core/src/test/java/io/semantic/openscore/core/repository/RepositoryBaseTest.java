package io.semantic.openscore.core.repository;


import org.junit.Before;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.function.Supplier;

public abstract class RepositoryBaseTest {

    protected EntityManager entityManager;

    @Before
    public void setUp() {
        entityManager = Persistence
                .createEntityManagerFactory("test")
                .createEntityManager();
        beforeEach();
    }

    abstract protected void beforeEach();

    protected void transaction(Runnable runnable) {
        EntityTransaction tx = this.entityManager.getTransaction();
        tx.begin();
        runnable.run();
        tx.commit();
    }

    protected <T> T transaction(Supplier<T> runnable) {
        EntityTransaction tx = this.entityManager.getTransaction();
        tx.begin();
        T result = runnable.get();
        tx.commit();
        return result;
    }
}
