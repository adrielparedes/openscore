#!/usr/bin/env bash

REPO=https://github.com/adrielparedes/openscore
BRANCH=develop

oc new-app --name openscore-core wildfly:10.1~$REPO#$BRANCH

oc new-build --name openscore-ui httpd:2.4 --binary
oc start-build openscore-ui --from-dir=./openscore-ui/dist --wait

oc new-app --name openscore-ui openscore-ui:latest
oc expose svc/openscore-ui

oc new-app --template=postgresql-persistent -p POSTGRESQL_VERSION=9.4 -p POSTGRESQL_DATABASE=openscore -p POSTGRESQL_PASSWORD=redhat01 -p POSTGRESQL_USER=admin -p DATABASE_SERVICE_NAME=openscore-db -l app=openscore-db

oc import-image wildfly:10.1 --from docker.io/openshift/wildfly-101-centos7 --confirm -n openshift

oc new-build --name openscore-core wildfly:10.1 --binary
oc start-build openscore-core --from-file=./openscore-core/target/openscore-core.war --wait

oc new-app openscore-core:latest --name openscore-core -e POSTGRESQL_DATABASE=openscore -e POSTGRESQL_SERVICE_PORT=5432 -e POSTGRESQL_SERVICE_HOST=openscore-db -e POSTGRESQL_PASSWORD=redhat01 -e POSTGRESQL_USER=admin -e POSTGRESQL_DATASOURCE=openscore
oc expose svc/openscore-core