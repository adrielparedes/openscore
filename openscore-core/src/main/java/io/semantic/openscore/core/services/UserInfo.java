package io.semantic.openscore.core.services;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class UserInfo {

    private long userId;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
