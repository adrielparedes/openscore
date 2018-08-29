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

