#! /bin/bash

now=$(date +"%m_%d_%Y")
POD=$1

kubectl exec $POD -n openscore -- bash -c "psql -U openscore postgres -c \"$2\""
