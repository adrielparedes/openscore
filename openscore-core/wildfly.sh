#! /bin/bash

mvn clean install -Dmaven.test.skip=true && sudo docker-compose -f ./src/test/resources/docker/docker-compose.yml up --build
