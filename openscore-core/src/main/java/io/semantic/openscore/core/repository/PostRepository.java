package io.semantic.openscore.core.repository;

import io.semantic.openscore.core.model.Post;
import io.semantic.openscore.core.model.PostStatus;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class PostRepository extends Repository<Post> {

    private static final String FIND_ALL_BY_STATUS = "from Post where post.status = :status order by post.modificationDate";

    public PostRepository() {
        super(Post.class);
    }

    public List<Post> findAllByStatus(PostStatus postStatus) {
        TypedQuery<Post> query = this.createQuery(FIND_ALL_BY_STATUS);
        return this.findByQuery(query);
    }
}
