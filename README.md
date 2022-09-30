# Openscore

```bash
yarn install # Instala las dependencias necesarias para todos los proyectos salvo para los JAVA
yarn build # Hace el build de todos los proyectos que tengan en su respectivo package.json implementado el script "build"
yarn dev # Ejecuta todos los proyectos que tengan implementado el script "dev"


docker run --name openscore-db -p 5432:5432 -e POSTGRES_PASSWORD=0p3nsc0r3 -e POSTGRES_USER=openscore -d postgres

make push-ui-image push-core-image deploy-production reload-production
make push-ui-image deploy-production reload-production

```
