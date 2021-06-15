#! /bin/bash

now=$(date +"%m_%d_%Y")
POD=$(kubectl get pods -n openscore | grep openscore-db | awk '{print $1}')

kubectl exec $POD -n openscore -- bash -c "pg_dump -U openscore postgres" > "database_$now.sql"
