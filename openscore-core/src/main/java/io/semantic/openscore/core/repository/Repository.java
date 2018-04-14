package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Storable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.ws.rs.core.MultivaluedMap;
import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

public abstract class Repository<T extends Storable> {

    protected final Class<T> persistentClass;

    @PersistenceContext(unitName = "db")
    protected EntityManager entityManager;

    public Repository(Class<T> clazz) {
        this.persistentClass = clazz;
    }

    public Repository(Class<T> clazz,
                      EntityManager entityManager) {
        this(clazz);
        this.entityManager = entityManager;
    }

    public long save(T storable) {
        if (storable.getId() != 0) {
            this.entityManager.merge(storable);
        } else {
            this.entityManager.persist(storable);
        }
        return storable.getId();
    }

    public TypedQuery<T> createQuery(String query) {
        return this.entityManager.createQuery(query,
                this.persistentClass);
    }

    public Optional<T> findById(long id) {

        List<T> found = this.createQuery(MessageFormat.format("from {0} s where s.id=:id and s.deleted=false",
                this.persistentClass.getSimpleName())).setParameter("id",
                id).getResultList();

        if (!found.isEmpty()) {
            return Optional.of(found.get(0));
        } else {
            return Optional.empty();
        }
    }

    public Optional<T> findByIdWithDeleted(long id) {

        List<T> found = this.createQuery(MessageFormat.format("from {0} s where s.id=:id",
                this.persistentClass.getSimpleName())).setParameter("id",
                id).getResultList();

        if (!found.isEmpty()) {
            return Optional.of(found.get(0));
        } else {
            return Optional.empty();
        }
    }

    public List<T> findByQuery(TypedQuery<T> query,
                               Page page) {

        return query.setFirstResult(page.getPage() * page.getPageSize())
                .setMaxResults(page.getPageSize())
                .getResultList();
    }

    public List<T> findByQuery(TypedQuery<T> query) {

        return query.getResultList();
    }

    public void hardDeleteById(long id) {
        Optional<T> storable = this.findById(id);
        storable.ifPresent(entity -> entityManager.remove(entity));
    }

    public void hardDeleteByQuery(TypedQuery<T> query) {
        List<T> found = this.findByQuery(query,
                new Page(0,
                        0));
        found.forEach(entity -> entityManager.remove(entity));
    }

    public void deleteByQuery(TypedQuery<T> query) {
        List<T> found = this.findByQuery(query,
                new Page(0,
                        0));
        found.forEach(elem -> {
            elem.setDeleted(true);
            save(elem);
        });
    }

    public void deleteById(long id) {
        Optional<T> found = this.findById(id);
        found.ifPresent(elem -> {
            elem.setDeleted(true);
            this.save(elem);
        });
    }

    public List<T> findAll(Page page) {
        TypedQuery<T> query = this.createQuery(MessageFormat.format("from {0}",
                this.persistentClass.getSimpleName()));
        return this.findByQuery(query,
                page);
    }

    public List<T> findAll() {
        TypedQuery<T> query = this.createQuery(MessageFormat.format("from {0}",
                this.persistentClass.getSimpleName()));
        return this.findByQuery(query);
    }

    public List<T> findAll(Map<String, ?> parameters) {
        CriteriaBuilder cb = this.entityManager.getCriteriaBuilder();
        CriteriaQuery<T> query = cb.createQuery(this.persistentClass);
        Root<T> entity = query.from(this.persistentClass);

        List<Predicate> params = parameters
                .entrySet()
                .stream()
                .filter(entry -> entry.getValue() != null)
                .map(e -> cb.equal(entity.get(e.getKey()),
                        e.getValue()))
                .collect(toList());

        query.select(entity).where(cb.and(params.toArray(new Predicate[params.size()])));
        TypedQuery<T> typedQuery = this.entityManager.createQuery(query);
        return this.findByQuery(typedQuery);
    }
}
