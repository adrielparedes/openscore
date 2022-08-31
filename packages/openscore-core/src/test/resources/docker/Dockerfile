FROM jboss/wildfly:10.1.0.Final
RUN /opt/jboss/wildfly/bin/add-user.sh admin redhat.1 --silent
ADD target/openscore-core.war /opt/jboss/wildfly/standalone/deployments/ROOT.war
CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0", "-Djava.net.preferIPv4Stack=true"]
