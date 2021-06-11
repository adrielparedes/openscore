#! /bin/bash

mvn clean install -Dmaven.test.skip=true -Popenshift
docker build . -t openscore-core:latest
docker tag openscore-core:latest registry.digitalocean.com/openscore/openscore-core:latest
docker push registry.digitalocean.com/openscore/openscore-core:latest
