# SaaS IT Ticketing
Monorepo for microservices (NestJS), web (Next.js), and infra (AWS).

## Quick start
1) Install Node 22 (nvm), Docker Desktop  
2) Start local infra: `docker compose up -d`  
3) Build and run services (see service READMEs)

## Workspaces
- `services/*` – backend microservices (NestJS + Prisma)
- `web/*` – Next.js frontends
- `packages/*` – shared libs
- `infra/*` – Terraform/IaC
- `deploy/*` – Helm charts (Kubernetes)
