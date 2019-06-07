#! /bin/bash

mvn clean install -Dmaven.test.skip=true -Popenshift
oc start-build openscore-core --from-file=./target/openscore-core.war --wait
