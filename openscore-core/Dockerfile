FROM docker.io/jboss/wildfly:10.1.0.Final

ADD target/openscore-core.war /opt/jboss/wildfly/standalone/deployments/openscore-core.war
ADD src/main/docker/openscore.jks /opt/jboss/wildfly/standalone/configuration/openscore.jks
ADD src/main/docker/standalone.conf /opt/jboss/wildfly/bin/standalone.conf
ADD src/main/docker/customization /opt/jboss/wildfly/customization/
ADD src/main/docker/modules /opt/jboss/wildfly/modules/

RUN /opt/jboss/wildfly/customization/execute.sh