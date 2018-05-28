package io.semantic.openscore.core.cache;

import org.infinispan.Cache;
import org.infinispan.manager.DefaultCacheManager;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.util.Optional;

@ApplicationScoped
public class TokenCache {

    private Cache<String, String> cache;

    @PostConstruct
    public void initialize() throws IOException {
        this.cache = new DefaultCacheManager("infinispan.xml").getCache();
    }

    public boolean isValid(String email, String token) {
        Optional<String> t = Optional.ofNullable(this.cache.get(email));
        return t.map(x -> x.equals(token)).orElse(false);
    }

    public void remove(String email) {
        this.cache.remove(email);
    }

    public void add(String email, String token) {
        this.cache.put(email, token);
    }

    public Optional<String> getToken(String email) {
        return Optional.ofNullable(this.cache.get(email));
    }
}
