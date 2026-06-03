db-drop:
	docker rm -f openscore-ng-db

db-create:
	docker run --name openscore-ng-db -p 5432:5432 \
		-e POSTGRES_USER=openscore \
		-e POSTGRES_PASSWORD=0p3nsc0r3 \
		-e POSTGRES_DB=openscore_ng \
		-d postgres
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker exec openscore-ng-db pg_isready -U openscore -d openscore_ng; do sleep 1; done
	@if [ ! -f .env ]; then \
		echo "DATABASE_URL=postgresql://openscore:0p3nsc0r3@localhost:5433/openscore_ng" > .env; \
		echo "AUTH_SECRET=changeme" >> .env; \
		echo "Created .env"; \
	fi
	pnpm db:push && pnpm db:seed

db-seed:
	pnpm db:generate && pnpm db:push && pnpm db:seed
