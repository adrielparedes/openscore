package io.semantic.openscore.core.repository;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.persistence.TypedQuery;

import io.semantic.openscore.core.model.Post;
import io.semantic.openscore.core.model.PostStatus;

@ApplicationScoped
public class PostRepository extends Repository<Post> {

    private static final String FIND_ALL_BY_STATUS = "from Post where status = :status order by modificationDate";

    public PostRepository() {
        super(Post.class);
    }

    public List<Post> findAllByStatus(PostStatus postStatus) {
        TypedQuery<Post> query = this.createQuery(FIND_ALL_BY_STATUS);
        query.setParameter("status",postStatus);
        return this.findByQuery(query);
    }

    @Override
    public boolean exist(Post entity) {
        return false;
    }
}
