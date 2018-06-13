package io.semantic.openscore.core.cache;

import org.infinispan.Cache;
import org.infinispan.manager.DefaultCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.util.Optional;

@ApplicationScoped
public class TokenCache {


    private Logger logger = LoggerFactory.getLogger(TokenCache.class);
    private Cache<String, String> cache;

    @PostConstruct
    public void initialize() throws IOException {
        this.cache = new DefaultCacheManager("infinispan.xml")
                .getCache("local");
    }

    public boolean isValid(String email, String token) {
        Optional<String> t = Optional.ofNullable(this.cache.get(email));
        return t.map(x -> x.equals(token)).orElse(false);
    }

    public void remove(String email) {
        this.cache.remove(email);
        logger.info("Entry <{}> removed, new object count: {}", email, this.cache.size());
    }

    public void add(String email, String token) {
        this.cache.put(email, token);
        logger.info("Entry <{}> added, new object count: {}", email, this.cache.size());
    }

    public Optional<String> getToken(String email) {
        String token = this.cache.get(email);
        logger.info("For key <{}>, value found: <{}>", email, token);
        return Optional.ofNullable(token);
    }
}
