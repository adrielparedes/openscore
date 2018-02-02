package io.semantic.openscore.core.repository;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class RepositoryTest extends RepositoryBaseTest {

    private Repository repository;
    private Logger logger = LoggerFactory.getLogger(RepositoryTest.class);

    @Override
    protected void beforeEach() {
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
        this.repository.deleteByQuery(query);
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