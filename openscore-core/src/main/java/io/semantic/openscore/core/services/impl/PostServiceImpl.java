package io.semantic.openscore.core.services.impl;

import io.semantic.openscore.core.api.ApiResponse;
import io.semantic.openscore.core.api.post.CrearPost;
import io.semantic.openscore.core.model.Post;
import io.semantic.openscore.core.model.PostStatus;
import io.semantic.openscore.core.model.Rol;
import io.semantic.openscore.core.repository.Page;
import io.semantic.openscore.core.repository.PostRepository;
import io.semantic.openscore.core.security.Secure;
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
    @Secure(Rol.ADMIN)
    public ApiResponse<Post> publicar(long id) {
        return ok(cambiarStatus(id, PostStatus.PUBLICADO));
    }

    @Override
    @Secure(Rol.ADMIN)
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
    public ApiResponse<Post> add(CrearPost entity) {
        Post post = new Post();
        savePost(entity, post);
        return ok(post);
    }

    private void savePost(CrearPost entity, Post post) {
        post.setTitulo(entity.getTitulo());
        post.setContenido(entity.getContenido());
        post.setAutor(entity.getAutor());
        post.setStatus(PostStatus.BORRADOR);
        this.postRepository.save(post);
    }

    @Override
    public ApiResponse<Post> update(long id, CrearPost entity) {
        Post post = this.getPost(id);
        savePost(entity, post);
        return ok(post);
    }
}
