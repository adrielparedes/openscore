#!/usr/bin/env bash

REPO=https://github.com/adrielparedes/openscore
BRANCH=develop

# Creates the openscore-core pipeline
oc new-app $REPO#$BRANCH --context-dir=openscore-core --strategy=pipeline --name="openscore-core-pipeline" -n openscore

oc set env bc/openscore-core-pipeline REPO=$REPO -n openscore
oc set env bc/openscore-core-pipeline BRANCH=$BRANCH -n openscore

# Creates the openscore-ui pipeline
oc new-app $REPO#$BRANCH --context-dir=openscore-ui --strategy=pipeline --name="openscore-ui-pipeline" -n openscore

oc set env bc/openscore-ui-pipeline REPO=$REPO -n openscore
oc set env bc/openscore-ui-pipeline BRANCH=$BRANCH -n openscore

oc create configmap openscore-core-config --from-file=../openscore-core/src/main/resources/configmap.properties

oc create configmap openscore-core-config \
    --from-literal=POSTGRESQL_DATABASE=openscore \
    --from-literal=POSTGRESQL_SERVICE_PORT=5432 \
    --from-literal=POSTGRESQL_SERVICE_HOST=openscore-db \
    --from-literal=POSTGRESQL_PASSWORD=redhat01 \
    --from-literal=POSTGRESQL_USER=admin \
    --from-literal=POSTGRESQL_DATASOURCE=openscore