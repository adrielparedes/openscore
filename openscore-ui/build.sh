#! /bin/bash

ng build --prod --aot --env=prod
docker build . -t openscore-ui:latest
docker tag openscore-ui:latest registry.digitalocean.com/openscore/openscore-ui:latest
docker push registry.digitalocean.com/openscore/openscore-ui:latest
