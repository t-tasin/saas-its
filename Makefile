# Makefile
# One-liners to bootstrap DB, generate Prisma clients, run migrations, apply RLS, and seed.

# Adjust if your compose service name for Postgres isn't "postgres"
PG_SERVICE ?= postgres
# Adjust if your admin user isn't "app"
PGUSER     ?= app
# Primary DB name we connect to for bootstrap.sql (it creates app_shadow inside)
PGDB       ?= app

# Helper: run psql inside the container with -T (no TTY)
define PSQL
	docker compose exec -T $(PG_SERVICE) psql -U $(PGUSER) -d $(PGDB)
endef

.PHONY: up db.bootstrap prisma.gen migrate seed dev.all

up:
	docker compose up -d

db.bootstrap:
	# Create app_shadow database if it doesn't exist
	docker compose exec -T $(PG_SERVICE) psql -U $(PGUSER) -d $(PGDB) -tc \
		"SELECT 1 FROM pg_database WHERE datname = 'app_shadow'" | grep -q 1 || \
		docker compose exec -T $(PG_SERVICE) psql -U $(PGUSER) -d postgres -c \
		"CREATE DATABASE app_shadow OWNER $(PGUSER)"
	# Run bootstrap SQL
	$(PSQL) < infra/sql/bootstrap.sql

prisma.gen:
	npm -w services/identity-svc run prisma:gen
	npm -w services/asset-svc run prisma:gen
	npm -w services/ticket-svc run prisma:gen
	npm -w services/reservation-svc run prisma:gen

migrate:
	npm -w services/identity-svc run prisma:migrate
	npm -w services/asset-svc run prisma:migrate
	npm -w services/ticket-svc run prisma:migrate
	npm -w services/reservation-svc run prisma:migrate

seed:
	npm -w services/asset-svc run seed
	npm -w services/ticket-svc run seed
	npm -w services/reservation-svc run seed

dev.all:
	npm -w services/identity-svc run start:dev & \
	npm -w services/asset-svc run start:dev & \
	npm -w services/ticket-svc run start:dev & \
	npm -w services/reservation-svc run start:dev
