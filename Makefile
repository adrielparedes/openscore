REGISTRY ?= registry.digitalocean.com
DORP ?= docker

dev-core: 
	mvn clean quarkus:dev -f openscore-core

dev-ui:
	@cd openscore-ui && yarn dev

build-core:
	mvn package -f openscore-core

build-core-image: build-core
	${DORP} build -f openscore-core/src/main/docker/Dockerfile.jvm --platform=linux/amd64 -t openscore/openscore-core openscore-core

push-core-image: build-core-image
	${DORP} tag openscore/openscore-core ${REGISTRY}/openscore/openscore-core
	${DORP} push ${TLS_VERIFY} ${REGISTRY}/openscore/openscore-core

reload-core-image:
	kubectl delete pods -l app=openscore-core -n openscore

build-ui:
	@cd openscore-ui && yarn install && yarn build

build-ui-image: build-ui
	${DORP} build -f openscore-ui/Dockerfile --platform=linux/amd64 -t openscore/openscore-ui openscore-ui

push-ui-image: build-ui-image
	${DORP} tag openscore/openscore-ui ${REGISTRY}/openscore/openscore-ui
	${DORP} push ${TLS_VERIFY} ${REGISTRY}/openscore/openscore-ui

reload-ui-image:
	kubectl delete pods -l app=openscore-ui -n openscore

deploy-core-production: push-core-image
	kubectl apply -k openscore-core/k8s/overlays/production

deploy-ui-production: push-ui-image
	kubectl apply -k openscore-ui/k8s/overlays/production
	
deploy-core-local: push-core-image
	kubectl apply -k openscore-core/k8s/overlays/local

deploy-ui-local: push-ui-image
	kubectl apply -k openscore-ui/k8s/overlays/local

deploy-production: deploy-core-production reload-core-image deploy-ui-production reload-ui-image