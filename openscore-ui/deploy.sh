#! /bin/bash

ng build --prod --aot --env=openshift
oc start-build openscore-ui --from-dir=./dist --wait
