-- infra/sql/bootstrap.sql
-- Bootstrap local Postgres for single-institution IT helpdesk system.
-- Safe to re-run.

DO $$ BEGIN
   CREATE ROLE app LOGIN PASSWORD 'app';
EXCEPTION WHEN duplicate_object THEN
   RAISE NOTICE 'role app exists, skipping';
END $$;

-- Extensions (uuid + pgcrypto helpful)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Service schemas (owned by app)
DO $$ BEGIN
   EXECUTE 'CREATE SCHEMA IF NOT EXISTS identity AUTHORIZATION app';
   EXECUTE 'CREATE SCHEMA IF NOT EXISTS asset AUTHORIZATION app';
   EXECUTE 'CREATE SCHEMA IF NOT EXISTS ticket AUTHORIZATION app';
END $$;

-- Grant app full access to all schemas
GRANT ALL ON SCHEMA identity, asset, ticket TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA identity GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA asset    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA ticket   GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
