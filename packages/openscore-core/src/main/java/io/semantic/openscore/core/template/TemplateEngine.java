package io.semantic.openscore.core.template;

import com.mitchellbosecke.pebble.PebbleEngine;
import com.mitchellbosecke.pebble.template.PebbleTemplate;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import java.io.StringWriter;
import java.util.Map;

@ApplicationScoped
public class TemplateEngine {

    private PebbleEngine engine;

    @PostConstruct
    public void initialize() {
        engine = new PebbleEngine.Builder().build();
    }

    public String evaluate(String templateName, Map<String, Object> params) {
        try {
            StringWriter stringWriter = new StringWriter();
            PebbleTemplate compiledTemplate = this.engine.getTemplate(buildTemplateName(templateName));
            compiledTemplate.evaluate(stringWriter, params);
            return stringWriter.toString();
        } catch (Exception e) {
            throw new TemplateEngineException("Can't process template", e);
        }
    }

    private String buildTemplateName(String templateName) {
        return "templates/" + templateName + ".html";
    }
}
