#! /bin/bash

JDBC_VERSION=42.2.2
JDBC_MODULE_FOLDER=./src/main/docker/modules/org/postgresql/jdbc/main

# Descargar driver postgresql
echo "############# Descargando driver de PostgreSQL ${JDBC_VERSION} ################"
wget https://jdbc.postgresql.org/download/postgresql-$JDBC_VERSION.jar -O ${JDBC_MODULE_FOLDER}/postgresql.jar 

touch ${JDBC_MODULE_FOLDER}/$JDBC_VERSION.version
