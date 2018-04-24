package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.post.CreatePost;
import io.semantic.openscore.core.model.Post;
import io.semantic.openscore.core.model.PostStatus;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PostRepository;
import io.semantic.openscore.core.services.api.PostService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.util.List;

import static io.semantic.openscore.core.services.RestUtil.ok;

@RequestScoped
public class PostServiceImpl implements PostService {

    private PostRepository postRepository;

    public PostServiceImpl() {
    }

    @Inject
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public ApiResponse<List<Post>> getAll(int page, int pageSize, String postStatus) {

        if (postStatus != null && !postStatus.isEmpty()) {
            PostStatus status = PostStatus.valueOf(postStatus);
            return ok(this.postRepository.findAllByStatus(status));
        } else {
            return ok(this.postRepository.findAll(new Page(page, pageSize)));
        }
    }

    @Override
    public ApiResponse<Post> publicar(long id) {
        return ok(cambiarStatus(id, PostStatus.PUBLICADO));
    }

    @Override
    public ApiResponse<Post> retirar(long id) {
        return ok(cambiarStatus(id, PostStatus.BORRADOR));
    }

    private Post cambiarStatus(long id, PostStatus status) {
        Post post = this.getPost(id);
        post.setStatus(status);
        this.postRepository.save(post);
        return post;
    }

    @Override
    public ApiResponse<Post> get(long id) {
        return ok(getPost(id));
    }

    private Post getPost(long id) {
        return this.postRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException(MessageFormat.format("El post con el ID <{0}> no existe", id)));
    }

    @Override
    public ApiResponse<Long> delete(long id) {
        this.postRepository.deleteById(id);
        return ok(id);
    }

    @Override
    public ApiResponse<Post> add(CreatePost entity) {
        Post post = new Post();
        post.setTitulo(entity.getTitulo());
        post.setContenido(entity.getContenido());
        post.setStatus(PostStatus.BORRADOR);
        this.postRepository.save(post);
        return ok(post);
    }

    @Override
    public ApiResponse<Post> update(long id, CreatePost entity) {
        Post post = this.getPost(id);
        post.setTitulo(entity.getTitulo());
        post.setContenido(entity.getContenido());
        post.setStatus(PostStatus.BORRADOR);
        this.postRepository.save(post);
        return ok(post);
    }
}
