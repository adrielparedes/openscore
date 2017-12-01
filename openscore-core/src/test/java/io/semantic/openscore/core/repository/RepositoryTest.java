package io.semantic.openscore.core.repository;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.TypedQuery;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RepositoryTest {

    private Repository repository;
    private Logger logger = LoggerFactory.getLogger(RepositoryTest.class);
    private EntityManager entityManager;

    @BeforeEach
    void beforeEach() {

        entityManager = Persistence
                .createEntityManagerFactory("h2")
                .createEntityManager();
        this.repository = new TestRepository(entityManager);
    }

    @Test
    void testSaveElement() {
        TestObject original = new TestObject();
        original.setName("OpenScore");

        long id = transaction(() -> this.repository.save(original));

        Optional<TestObject> testObject = this.repository.findById(id);
        assertEquals(original.getName(),
                     testObject.get().getName());
        assertFalse(testObject.get().isDeleted());
        assertNotNull(testObject.get().getCreationDate());
    }

    private void transaction(Runnable runnable) {
        EntityTransaction tx = this.entityManager.getTransaction();
        tx.begin();
        runnable.run();
        tx.commit();
    }

    private <T> T transaction(Supplier<T> runnable) {
        EntityTransaction tx = this.entityManager.getTransaction();
        tx.begin();
        T result = runnable.get();
        tx.commit();
        return result;
    }

    @Test
    void testFindByQuery() {
        TestObject original = new TestObject("OpenScore");
        transaction(() -> this.repository.save(original));
        TypedQuery<TestObject> query = this.repository.createQuery("from TestObject t where t.name = :name").setParameter("name",
                                                                                                                          "OpenScore");
        List<TestObject> elements = this.repository.findByQuery(query,
                                                                new Page(0,
                                                                         1));
        assertEquals(original.getName(),
                     elements.get(0).getName());
    }

    @Test
    void testHardDeleteByQuery() {
        TestObject original = new TestObject("OpenScore");
        transaction(() -> this.repository.save(original));
        TypedQuery<TestObject> query = this.repository.createQuery("from TestObject where name = :name").setParameter("name",
                                                                                                                      "OpenScore");
        assertEquals(1,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());
        transaction(() -> this.repository.hardDeleteByQuery(query));
        assertEquals(0,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());
    }

    @Test
    void testHardDeleteById() {
        TestObject original = new TestObject("OpenScore");
        long id = transaction(() -> this.repository.save(original));
        TypedQuery<TestObject> query = this.repository.createQuery("from TestObject where name = :name").setParameter("name",
                                                                                                                      "OpenScore");

        assertEquals(1,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());

        transaction(() -> this.repository.hardDeleteById(id));

        assertEquals(0,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());
    }

    @Test
    void testDeleteByQuery() {
        TestObject original = new TestObject("OpenScore");
        long id = transaction(() -> this.repository.save(original));
        TypedQuery<TestObject> query = this.repository.createQuery("from TestObject where name = :name").setParameter("name",
                                                                                                                      "OpenScore");
        assertEquals(1,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());
        transaction(() -> this.repository.deleteByQuery(query));
        assertEquals(1,
                     this.repository.findByQuery(query,
                                                 new Page(0,
                                                          1)).size());
        assertTrue(query.getSingleResult().isDeleted());
    }

    @Test
    void testDeleteById() {
        TestObject original = new TestObject("OpenScore");
        long id = transaction(() -> this.repository.save(original));
        TypedQuery<TestObject> query = this.repository.createQuery("from TestObject where name = :name").setParameter("name",
                                                                                                                      "OpenScore");
        assertEquals(1,
                     query.getResultList().size());
        this.repository.deleteById(id);
        assertEquals(1,
                     query.getResultList().size());
        assertTrue(query.getSingleResult().isDeleted());
    }
}