#! /bin/bash

now=$(date +"%m_%d_%Y")
POD=$1

kubectl exec $POD -n openscore -- bash -c "pg_dump -U openscore openscore" > "database_$now.sql"
