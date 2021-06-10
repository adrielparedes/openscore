FROM docker.io/jboss/wildfly:10.1.0.Final

ADD src/main/docker/customization /opt/jboss/wildfly/customization/
ADD src/main/docker/modules /opt/jboss/wildfly/modules/

RUN /opt/jboss/wildfly/customization/execute.sh

ADD target/openscore-core.war /opt/jboss/wildfly/standalone/deployments/openscore-core.war