package io.semantic.openscore.core.email;

import java.util.HashMap;
import java.util.Map;

public class MailFactory {

    public MailTemplate getRecoverPasswordEmail(String to, String token) {
        Map<String, Object> map = new HashMap<>();
        map.put("email", to);
        map.put("token", token);
        return new MailTemplate(to, "Recover Password", "recover", map);
    }
}
