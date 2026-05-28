# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Openscore is a sports prediction (prode) platform. The repo contains three modules:

- **`openscore-core`** — Java 11 / Quarkus 2.12 REST backend with PostgreSQL *(legacy)*
- **`openscore-ui`** — Next.js 12 / React 18 / TypeScript frontend *(legacy, consumes openscore-core)*
- **`openscore-ng`** — Next.js 16 / React 19 full-stack rewrite (App Router, Prisma 7, NextAuth v5, Tailwind v4)

## Development Commands

### Backend (openscore-core)

```bash
# Start PostgreSQL (required before running the core)
docker run --name openscore-db -p 5432:5432 -e POSTGRES_PASSWORD=0p3nsc0r3 -e POSTGRES_USER=openscore -d postgres

# Run in dev mode (hot reload)
make dev-core
# or directly:
mvn clean quarkus:dev -f openscore-core -Duser.timezone=UTC

# Run tests
mvn test -f openscore-core

# Build JAR
make build-core
```

### Frontend (openscore-ui)

```bash
# Install dependencies
cd openscore-ui && yarn install

# Dev server (http://localhost:3000)
make dev-ui
# or:
cd openscore-ui && yarn dev

# Build for production
make build-ui

# Lint
cd openscore-ui && yarn lint
```

### Full-stack rewrite (openscore-ng)

```bash
# Install deps
cd openscore-ng && pnpm install

# Copy env and fill in values
cp .env.example .env

# Generate Prisma client
pnpm db:generate

# Push schema to DB (dev) or run migrations (prod)
pnpm db:push

# Seed initial data (countries, teams, phases, admin user)
pnpm db:seed

# Dev server (http://localhost:3000)
pnpm dev

# Build
pnpm build
```

### Deployment (Kubernetes / DigitalOcean registry)

```bash
make push-ui-image push-core-image deploy-production reload-production
```

## Architecture

### Backend (Quarkus)

The backend follows a layered architecture under `io.semantic.openscore.core`:

- **`model/`** — JPA entities (`Partido`, `Pronostico`, `Usuario`, `Equipo`, `Fase`, `Grupo`, etc.)
- **`repository/`** — Data access layer with a base `Repository<T>` class. Each entity has its own repository.
- **`services/api/`** — JAX-RS REST resource interfaces (the actual HTTP endpoints live here)
- **`services/impl/`** — Service implementations containing business logic
- **`api/`** — DTO classes used for request/response serialization (MapStruct mappers in `mapping/`)
- **`security/`** — Custom JWT-based auth: `@Secure` annotation + `SecureFilter` JAX-RS filter. Roles are validated on each request by looking up the user from the token's email claim.
- **`repository/startup/`** — `StartupManager` runs ordered `StartupStep` beans on application startup to seed initial data (countries, teams, phases, matches, secret questions) from `src/main/resources/data/`.

**Auth flow:** The frontend sends `Authorization: Bearer <JWT>`. `SecureFilter` decodes it, looks up the `Usuario` in the DB, checks roles, and injects the user into a `@RequestScoped` `UserInfo` bean for downstream use.

### Frontend (Next.js)

- **`pages/`** — Next.js file-system routing. All pages use a shared `MainLayout` from `components/templates/`.
- **`services/`** — API clients. All extend `Service<T, CreateDTO, UpdateDTO>` (CRUD base class in `services/Service.ts`) which wraps an Axios instance (`services/Rest.ts`) configured with `NEXT_PUBLIC_BASE_URL` as the base URL pointing to the Quarkus backend.
- **`states/`** — Recoil atoms and selectors for global state. Key states: `SecurityState.ts` (JWT token, user info, role checks), `PaisesState.ts` (countries preloaded at app init), `ForecastState.ts`, `FilterState.ts`.
- **`model/`** — TypeScript interfaces mirroring backend DTOs.
- **`hooks/`** — Custom React hooks.

**Auth flow:** Token is stored in `localStorage` under key `openscore-token`. `SecurityContext` in `_app.tsx` reads it on mount and sets the Axios `Authorization` header globally. Unauthenticated users are redirected to `/login`.

### Environment

The frontend reads `NEXT_PUBLIC_BASE_URL` from `.env.development` (defaults to `http://localhost:8080`). The backend runs on port 8080 and serves all API under `/api/rest/`.

Database config is in `openscore-core/src/main/resources/application.properties` — Hibernate auto-updates the schema on startup (`hibernate-orm.database.generation=update`).

### Full-stack rewrite (openscore-ng)

Architecture replaces the Java REST layer with Next.js 16 App Router server-side features:

- **`app/(auth)/`** — Public login/register pages (no layout wrapper)
- **`app/(main)/`** — Protected pages behind `middleware.ts` auth check; shared `Navbar` layout
- **`app/api/auth/[...nextauth]/`** — NextAuth v5 route handler
- **`actions/`** — Server Actions replacing every Java service: `auth`, `partidos`, `pronosticos`, `ranking`, `standings`, `usuarios`, `posts`
- **`lib/prisma.ts`** — Singleton PrismaClient using `@prisma/adapter-pg` (required by Prisma 7)
- **`lib/auth.ts`** — NextAuth config with Credentials provider; SHA-256 password hashing matches the legacy Java implementation
- **`lib/utils.ts`** — Shared helpers: `hashPassword` (SHA-256), `isBloqueado` (15-min lock), `calcularGanador`, `calcularStatus`
- **`prisma/schema.prisma`** — Full schema mirroring the Java JPA entities
- **`prisma.config.ts`** — Prisma 7 datasource config (URL goes here, not in schema)
- **`types/index.ts`** — Enriched TypeScript types (e.g. `PartidoConRelaciones` with `status` and `ganador` computed fields)
- **`components/forecast/`** — Client components for the forecast feature (`MatchCard` uses `useTransition` for optimistic prediction updates)

**Auth flow:** NextAuth session cookie → `middleware.ts` redirects unauthenticated requests to `/login`. Server Actions call `auth()` to get the session and extract `user.id` / `user.roles`.

**Scoring logic** (ported from Java): match points = `fase.puntos` if prediction matches `ganador`; `ganador` for penalty matches uses the shootout score, not the 90-min score. A match locks 15 minutes before `dia`.

**Environment variables required:** `DATABASE_URL`, `AUTH_SECRET`.
