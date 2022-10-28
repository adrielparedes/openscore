REGISTRY ?= registry.digitalocean.com
DORP ?= docker

build-core:
	mvn package -f packages/openscore-core-quarkus

build-core-image: build-core
	${DORP} build -f packages/openscore-core-quarkus/src/main/docker/Dockerfile.jvm --platform=linux/amd64 -t openscore/openscore-core packages/openscore-core-quarkus

push-core-image: build-core-image
	${DORP} tag openscore/openscore-core ${REGISTRY}/openscore/openscore-core
	${DORP} push ${REGISTRY}/openscore/openscore-core
	
build-ui:
	@cd packages/openscore-nextjs && yarn install && yarn build

build-ui-image: build-ui
	${DORP} build -f packages/openscore-nextjs/Dockerfile --platform=linux/amd64 -t openscore/openscore-ui packages/openscore-nextjs

push-ui-image: build-ui-image
	${DORP} tag openscore/openscore-ui ${REGISTRY}/openscore/openscore-ui
	${DORP} push ${REGISTRY}/openscore/openscore-ui

deploy-production:
	kubectl apply -k ./packages/openscore-k8s/overlays/production

reload-production:
	kubectl delete pod --all -n openscore

deploy-local:
	kubectl apply -k ./packages/openscore-k8s/overlays/local