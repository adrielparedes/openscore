package io.semantic.openscore.core.repository.startup;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import java.text.MessageFormat;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@ApplicationScoped
public class StartupManager {

    private List<StartupStep> steps;
    private Logger logger = LoggerFactory.getLogger(StartupManager.class);

    public StartupManager() {

    }

    @Inject
    public StartupManager(Instance<StartupStep> startupSteps) {
        steps = StreamSupport.stream(startupSteps.spliterator(), false).collect(Collectors.toList());
    }


    public void initialize(@Observes @Initialized(ApplicationScoped.class) Object init) {
        this.logger.info(MessageFormat.format("StartupSteps found: {0}", this.steps.size()));
        Collections.sort(this.steps, Comparator.comparingInt(StartupStep::priority));
        this.logger.info(MessageFormat.format("StartupSteps sorted: \n|_ {0}",
                this.steps.stream()
                        .map(startupStep -> startupStep.getClass().getSimpleName() + " -- p: " + startupStep.priority())
                        .collect(Collectors.joining("\n|_ "))));
        this.steps.forEach(StartupStep::run);
    }

}
