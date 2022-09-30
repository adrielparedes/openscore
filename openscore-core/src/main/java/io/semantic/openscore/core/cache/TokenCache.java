package io.semantic.openscore.core.cache;

import java.util.Optional;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

import javax.enterprise.context.ApplicationScoped;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

@ApplicationScoped
public class TokenCache {

    @ConfigProperty(name = "openscore.cache.expire")
    private int EXPIRE_TIME;

    private Logger logger = LoggerFactory.getLogger(TokenCache.class);
    private LoadingCache<String, String> cache;

    public TokenCache() {
        CacheLoader<String, String> loader;
        loader = new CacheLoader<String, String>() {
            @Override
            public String load(final String key) {
                return key.toUpperCase();
            }
        };

        this.cache = CacheBuilder.newBuilder()
                .maximumSize(50)
                .expireAfterWrite(EXPIRE_TIME, TimeUnit.MINUTES)
                .build(loader);

    }

    public boolean isValid(String email, String token) {
        Optional<String> t;
        try {
            t = Optional.ofNullable(this.cache.get(email));
            return t.map(x -> x.equals(token)).orElse(false);
        } catch (ExecutionException e) {
            logger.error("Error al validar token para email: " + email, e);
        }
        return false;
    }

    public void remove(String email) {
        this.cache.invalidate(email);
        logger.info("Entry <{}> removed, new object count: {}", email, this.cache.size());
    }

    public void add(String email, String token) {
        this.cache.put(email, token);
        logger.info("Entry <{}> added, new object count: {}", email, this.cache.size());
    }

    public Optional<String> getToken(String email) {
        String token = null;
        try {
            token = this.cache.get(email);
        } catch (ExecutionException e) {
            logger.error("Error al obtener token para email: " + email, e);
        }
        logger.info("For key <{}>, value found: <{}>", email, token);
        return Optional.ofNullable(token);
    }
}
