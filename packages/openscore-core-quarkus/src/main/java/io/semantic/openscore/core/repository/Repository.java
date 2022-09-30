package io.semantic.openscore.core.repository;

import static java.util.stream.Collectors.joining;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.semantic.openscore.core.model.Storable;

public abstract class Repository<T extends Storable> {

    protected final Class<T> persistentClass;

    private Logger logger = LoggerFactory.getLogger(Repository.class);

    @Inject
    protected EntityManager entityManager;

    public Repository(Class<T> clazz) {
        this.persistentClass = clazz;
    }

    public Repository(Class<T> clazz,
            EntityManager entityManager) {
        this(clazz);
        this.entityManager = entityManager;
    }

    @Transactional
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
                        id)
                .getResultList();

        if (!found.isEmpty()) {
            return Optional.of(found.get(0));
        } else {
            return Optional.empty();
        }
    }

    public Optional<T> findByIdWithDeleted(long id) {

        List<T> found = this.createQuery(MessageFormat.format("from {0} s where s.id=:id",
                this.persistentClass.getSimpleName())).setParameter("id",
                        id)
                .getResultList();

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

    @Transactional
    public void hardDeleteById(long id) {
        Optional<T> storable = this.findById(id);
        storable.ifPresent(entity -> entityManager.remove(entity));
    }

    @Transactional
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

    @Transactional
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

    public List<T> findAll(Map<String, Object> parameters, Map<String, Sort> sort) {
        String queryString = this.buildQuery(parameters, sort);
        TypedQuery<T> query = this.createQuery(queryString);

        parameters.entrySet().forEach(entry -> {
            query.setParameter(entry.getKey().replace(".", "_"), entry.getValue());
        });

        return this.findByQuery(query);
    }

    private String buildQuery(Map<String, Object> parameters, Map<String, Sort> sort) {

        String queryString = "from {0} ";

        if (!parameters.isEmpty()) {
            queryString += "where ";
            queryString += parameters.entrySet()
                    .stream()
                    .map(entry -> entry.getKey() + " = :" + entry.getKey().replace(".", "_"))
                    .collect(joining(" AND "));
        }

        String formatted = MessageFormat.format(queryString,
                this.persistentClass.getSimpleName());

        if (!sort.isEmpty()) {
            formatted += " order by " +
                    sort.entrySet()
                            .stream()
                            .map(entry -> entry.getKey() + " " + entry.getValue().toString())
                            .collect(joining(" , "));
        }
        return formatted;
    }

    public abstract boolean exist(T entity);
}
