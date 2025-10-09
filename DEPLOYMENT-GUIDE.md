# IT Helpdesk System - Deployment & Integration Guide

## 🎯 Project Status

### ✅ Completed Features

#### Backend Services (4/4)
1. **Identity Service** (Port 3000)
   - User registration & authentication
   - JWT token generation
   - Role-based access control (General, Operator, Admin)
   - Profile management

2. **Ticket Service** (Port 3001)
   - Ticket creation (public + authenticated)
   - Ticket management (status updates, assignment)
   - Categories & Subcategories management
   - Comments system
   - Auto-generated ticket numbers (YYMMDD-####)
   - Priority levels (low, medium, high, urgent)

3. **Asset Service** (Port 3002)
   - Asset inventory management
   - Asset types & categorization
   - Asset assignment/unassignment
   - Lifecycle tracking
   - Status management (available, assigned, maintenance, retired)

4. **Reservation Service** (Port 3003) ✨ NEW
   - Equipment reservation requests
   - Approval/denial workflow
   - Availability checking
   - Reservation lifecycle (pending → approved → active → returned)
   - Date-based conflict detection

#### Architecture Features
- ✅ Single-institution mode (multi-tenancy removed)
- ✅ Role-Based Access Control (RBAC)
- ✅ RESTful API design
- ✅ Swagger/OpenAPI documentation
- ✅ Cursor-based pagination
- ✅ Idempotency middleware
- ✅ Audit logging
- ✅ Health check endpoints
- ✅ CORS configuration

---

## 📡 API Endpoints Overview

### Identity Service (3000)
```
POST   /v1/auth/register
POST   /v1/auth/login
GET    /v1/auth/me
PATCH  /v1/auth/me
GET    /v1/health
```

### Ticket Service (3001)
```
# Tickets
POST   /v1/tickets                    [Public]
GET    /v1/tickets                    [Public]
GET    /v1/tickets/:id                [Public]
PATCH  /v1/tickets/:id/status         [Operator/Admin]
GET    /v1/tickets/:id/comments       [Public]
POST   /v1/tickets/:id/comments       [Public]

# Categories
GET    /v1/categories                 [Public]
GET    /v1/categories/:id             [Public]
POST   /v1/categories                 [Operator/Admin]
PATCH  /v1/categories/:id             [Operator/Admin]
DELETE /v1/categories/:id             [Admin]
GET    /v1/categories/:id/subcategories  [Public]
POST   /v1/categories/:id/subcategories  [Operator/Admin]
PATCH  /v1/subcategories/:id          [Operator/Admin]
DELETE /v1/subcategories/:id          [Admin]

GET    /v1/health
```

### Asset Service (3002)
```
GET    /v1/assets                     [Operator/Admin]
POST   /v1/assets                     [Operator/Admin]
POST   /v1/assets/:id/assign          [Operator/Admin]
POST   /v1/assets/:id/unassign        [Operator/Admin]
GET    /v1/health
```

### Reservation Service (3003)
```
# Public endpoints
POST   /v1/reservations               [Public]
GET    /v1/reservations               [Public/Auth]
GET    /v1/reservations/:id           [Public/Auth]
POST   /v1/reservations/:id/cancel    [User/Operator/Admin]
GET    /v1/availability               [Public]
GET    /v1/availability/:assetTypeId  [Public]

# Operator/Admin endpoints
POST   /v1/reservations/:id/approve   [Operator/Admin]
POST   /v1/reservations/:id/deny      [Operator/Admin]
POST   /v1/reservations/:id/activate  [Operator/Admin]
POST   /v1/reservations/:id/return    [Operator/Admin]

GET    /v1/health
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Quick Start
```bash
# 1. Start infrastructure
docker compose up -d

# 2. Bootstrap database
make db.bootstrap

# 3. Generate Prisma clients
make prisma.gen

# 4. Push schemas to database
cd services/identity-svc && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=identity" npx prisma db push
cd services/asset-svc && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=asset" npx prisma db push
cd services/ticket-svc && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=ticket" npx prisma db push
cd services/reservation-svc && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=reservation" npx prisma db push

# 5. Seed data
make seed

# 6. Start all services
npm -w services/identity-svc run start:dev &
npm -w services/asset-svc run start:dev &
npm -w services/ticket-svc run start:dev &
npm -w services/reservation-svc run start:dev &
```

### Service URLs
- Identity: http://localhost:3000 (Docs: http://localhost:3000/docs)
- Ticket: http://localhost:3001 (Docs: http://localhost:3001/docs)
- Asset: http://localhost:3002 (Docs: http://localhost:3002/docs)
- Reservation: http://localhost:3003 (Docs: http://localhost:3003/docs)

---

## 🔐 Authentication Flow

### For General Users (No Login)
- Can create tickets directly
- Can create reservation requests
- Can view public data (categories, availability)

### For Operators/Admins (Login Required)
```bash
# 1. Register or Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@example.com",
    "password": "SecurePass123!"
  }'

# Response includes:
# {
#   "user": { ... },
#   "token": "eyJhbGci...",
#   "refreshToken": "..."
# }

# 2. Use token for authenticated endpoints
curl -X POST http://localhost:3002/v1/assets \
  -H "Authorization: Bearer eyJhbGci..." \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

---

## 📱 Frontend Integration Checklist

### Phase 1: Core Setup
- [ ] Set up API client (axios/fetch)
- [ ] Configure base URLs for each service
- [ ] Implement JWT token storage (localStorage/cookies)
- [ ] Create auth context/provider
- [ ] Add interceptors for Authorization header

### Phase 2: Authentication & User Management
- [ ] Login page
- [ ] Registration page
- [ ] User profile page
- [ ] Role-based routing/navigation
- [ ] Logout functionality

### Phase 3: Ticket System
- [ ] Ticket creation form (public)
- [ ] Ticket list (with filters by status, priority)
- [ ] Ticket detail view
- [ ] Comment section
- [ ] Category/subcategory dropdown (from API)
- [ ] Status update (for operators/admins)
- [ ] Assignment management

### Phase 4: Asset Management
- [ ] Asset inventory list
- [ ] Asset creation form
- [ ] Asset type management
- [ ] Assignment/unassignment UI
- [ ] Asset lifecycle viewer
- [ ] Search & filters

### Phase 5: Reservation System
- [ ] Equipment availability calendar
- [ ] Reservation request form
- [ ] My reservations page (user view)
- [ ] All reservations dashboard (operator view)
- [ ] Approval/denial workflow UI
- [ ] Pickup/return tracking
- [ ] Status indicators

### Phase 6: Dashboard & Analytics
- [ ] Operator dashboard (pending tickets, reservations)
- [ ] Statistics widgets (open tickets, available assets)
- [ ] Recent activity feed
- [ ] Quick actions

---

## 🌐 Production Deployment (AWS)

### Infrastructure Requirements

#### Compute
- **ECS Fargate** or **EKS** for containerized services
- 4 services × 2 replicas minimum = 8 containers
- Auto-scaling based on CPU/Memory

#### Database
- **RDS PostgreSQL** (Multi-AZ for high availability)
- Schema: `identity`, `ticket`, `asset`, `reservation`
- Automated backups, point-in-time recovery

#### Storage
- **S3** for file attachments (future feature)
- Versioning enabled
- Lifecycle policies for archival

#### Caching & Queuing
- **ElastiCache Redis** for idempotency middleware
- **SQS** or **SNS** for event notifications (future)

#### Load Balancing & Networking
- **Application Load Balancer** (ALB)
- Path-based routing to services
- SSL/TLS certificates (ACM)
- VPC with public/private subnets

#### DNS & CDN
- **Route 53** for domain management
- **CloudFront** for CDN (frontend + static assets)

### Environment Variables (Production)

```bash
# Identity Service
DATABASE_URL=postgresql://user:pass@rds-host:5432/app?schema=identity
JWT_SECRET=<strong-secret-key>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production

# Ticket Service
DATABASE_URL=postgresql://user:pass@rds-host:5432/app?schema=ticket
REDIS_URL=redis://elasticache-host:6379
PORT=3001
NODE_ENV=production

# Asset Service
DATABASE_URL=postgresql://user:pass@rds-host:5432/app?schema=asset
REDIS_URL=redis://elasticache-host:6379
PORT=3002
NODE_ENV=production

# Reservation Service
DATABASE_URL=postgresql://user:pass@rds-host:5432/app?schema=reservation
REDIS_URL=redis://elasticache-host:6379
PORT=3003
NODE_ENV=production
```

### Terraform Setup (Future)

```hcl
# infra/terraform/main.tf structure
- VPC & Networking
- RDS PostgreSQL
- ECS Cluster & Services
- ALB & Target Groups
- S3 Buckets
- ElastiCache Redis
- IAM Roles & Policies
- Security Groups
- CloudWatch Logs
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Build Docker images
      - Push to ECR
      - Update ECS services
      - Run migrations
      - Health checks
```

---

## 📊 Database Schema

### Identity Service
- **User**: id, email, password, name, role, isActive, timestamps

### Ticket Service
- **Ticket**: id, number, title, description, type, status, priority, requester fields, category IDs, dates
- **TicketComment**: id, ticketId, authorId, authorName, body, createdAt
- **Category**: id, name, createdAt
- **SubCategory**: id, categoryId, name, createdAt
- **TicketDayCounter**: yymmdd, seq (for auto-numbering)
- **AuditLog**: id, entity, entityId, action, actorId, at, metadata

### Asset Service
- **Asset**: id, assetTag, assetTypeId, summary, location, status, timestamps
- **AssetType**: id, name, createdAt
- **AssetAssignment**: id, assetId, personId, assignedAt, unassignedAt
- **LifecycleEvent**: id, assetId, action, actorId, metadata, occurredAt
- **AuditLog**: (same structure)

### Reservation Service
- **Reservation**: id, requesterId, email, name, status, dates, approval fields, notes, timestamps
- **ReservationItem**: id, reservationId, assetTypeId, assetTypeName, assetId, quantity, status, notes
- **EquipmentAvailability**: id, assetTypeId, assetTypeName, counts, updatedAt
- **AuditLog**: (same structure)

---

## 🔒 Security Checklist

- [x] Password hashing (bcrypt)
- [x] JWT authentication
- [x] Role-based access control
- [ ] Rate limiting (TODO)
- [ ] Input validation & sanitization (partial)
- [ ] SQL injection prevention (Prisma ORM)
- [ ] CORS configuration
- [ ] HTTPS/TLS in production
- [ ] Environment variable security
- [ ] API key rotation
- [ ] Audit logging

---

## 📚 Documentation

- **API-DOCUMENTATION.md**: Complete API reference for all services
- **RESERVATION-API.md**: Detailed reservation & category endpoints
- **Swagger UI**: Interactive API docs at each service `/docs` endpoint
- **This Guide**: Deployment and integration overview

---

## 🧪 Testing

### Manual Testing Script
```bash
# Test all services
./scripts/test-all-services.sh

# Test specific workflows
# 1. User registration & login
# 2. Ticket creation & management
# 3. Asset management
# 4. Reservation workflow
```

### Unit & Integration Tests (TODO)
- Jest for service testing
- Supertest for API testing
- Prisma test database
- GitHub Actions CI

---

## 🎯 Next Steps

### Immediate (For Frontend Integration)
1. ✅ All backend services running
2. ✅ Complete API documentation
3. ✅ Seed data for testing
4. 📌 Frontend can start integration using Swagger docs

### Short-term (2-4 weeks)
- [ ] File upload service (S3 integration)
- [ ] Email notification service
- [ ] Enhanced search & filters
- [ ] Reporting endpoints

### Medium-term (1-2 months)
- [ ] CI/CD pipeline setup
- [ ] AWS infrastructure (Terraform)
- [ ] Production deployment
- [ ] Monitoring & alerting (CloudWatch)
- [ ] Rate limiting & security hardening

### Long-term (3+ months)
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Analytics dashboard
- [ ] SLA tracking & automation
- [ ] Knowledge base integration

---

## 💡 Frontend Tool Integration (v0, Cursor AI)

### For v0.dev
Use this prompt with the API documentation:

```
Create a modern IT Helpdesk frontend using React + TypeScript + Tailwind CSS.

Architecture:
- 4 microservices (Identity, Ticket, Asset, Reservation)
- Role-based access: General (no auth), Operator, Admin
- JWT authentication

Key Features:
1. Public ticket submission form
2. User login/registration
3. Ticket dashboard with filters
4. Equipment reservation system
5. Asset management (operator/admin)
6. Category management

API Base URLs:
- Identity: http://localhost:3000/v1
- Ticket: http://localhost:3001/v1
- Asset: http://localhost:3002/v1
- Reservation: http://localhost:3003/v1

Full API documentation: [Paste API-DOCUMENTATION.md and RESERVATION-API.md]
```

### For Cursor AI
1. Open this workspace in Cursor
2. Ask Cursor to generate frontend components based on API docs
3. Reference `API-DOCUMENTATION.md` and `RESERVATION-API.md`
4. Use Swagger UI for interactive testing

---

## 📞 Support & Resources

- **Swagger Docs**: http://localhost:{port}/docs
- **GitHub Issues**: [Your repo URL]
- **API Documentation**: See `API-DOCUMENTATION.md`
- **Reservation Guide**: See `RESERVATION-API.md`

---

**System Ready for Frontend Development** ✅

All backend services are fully functional and documented. Frontend developers can start integration immediately using the Swagger UI and API documentation.

