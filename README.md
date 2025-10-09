# IT Helpdesk Ticketing System

A comprehensive IT helpdesk and asset management system with ticketing, equipment reservations, and user management.

## 🚀 Quick Start

```bash
# 1. Start infrastructure
docker compose up -d

# 2. Bootstrap database
make db.bootstrap

# 3. Generate Prisma clients & push schemas
cd services/identity-svc && npm install && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=identity" npx prisma generate && npx prisma db push
cd ../ticket-svc && npm install && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=ticket" npx prisma generate && npx prisma db push
cd ../asset-svc && npm install && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=asset" npx prisma generate && npx prisma db push
cd ../reservation-svc && npm install && DATABASE_URL="postgresql://app:app@localhost:5432/app?schema=reservation" npx prisma generate && npx prisma db push

# 4. Seed data
make seed

# 5. Start all services (in separate terminals or background)
npm -w services/identity-svc run start:dev
npm -w services/ticket-svc run start:dev
npm -w services/asset-svc run start:dev
npm -w services/reservation-svc run start:dev
```

## 📡 Services

| Service | Port | Swagger Docs | Status |
|---------|------|--------------|--------|
| Identity Service | 3000 | http://localhost:3000/docs | ✅ Ready |
| Ticket Service | 3001 | http://localhost:3001/docs | ✅ Ready |
| Asset Service | 3002 | http://localhost:3002/docs | ✅ Ready |
| Reservation Service | 3003 | http://localhost:3003/docs | ✅ Ready |

## ✨ Features Completed

### Backend (100%)
- ✅ **Identity Service**: User registration, authentication, JWT tokens, RBAC
- ✅ **Ticket Service**: Ticket CRUD, categories, subcategories, comments, auto-numbering
- ✅ **Asset Service**: Asset management, assignments, lifecycle tracking
- ✅ **Reservation Service**: Equipment reservations, approval workflow, availability checking

### Architecture
- ✅ Single-institution mode (multi-tenancy removed)
- ✅ Role-based access control (General, Operator, Admin)
- ✅ RESTful APIs with OpenAPI/Swagger docs
- ✅ Cursor-based pagination
- ✅ Audit logging
- ✅ Idempotency middleware
- ✅ CORS configuration

## 📚 Documentation

- **[API-DOCUMENTATION.md](./API-DOCUMENTATION.md)**: Complete API reference
- **[RESERVATION-API.md](./RESERVATION-API.md)**: Reservation & category endpoints guide
- **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**: Full deployment & integration guide
- **Swagger UI**: Interactive docs at each service `/docs` endpoint

## 🎯 User Roles

1. **General Users** (No Login Required)
   - Create tickets
   - Request equipment reservations
   - View public information

2. **Operators** (Login Required)
   - Manage tickets (assign, update status)
   - Approve/deny reservations
   - Manage assets
   - View all data

3. **Admins** (Login Required)
   - Full system access
   - Delete operations
   - User management
   - Category management

## 🔌 Frontend Integration

All endpoints are ready for frontend integration. Use:

1. **Swagger UI**: http://localhost:{port}/docs for interactive testing
2. **API Documentation**: See `API-DOCUMENTATION.md` for complete reference
3. **Integration Guide**: See `DEPLOYMENT-GUIDE.md` for frontend checklist

### Quick Frontend Setup with v0/Cursor AI

```bash
# Use API documentation with v0.dev or Cursor AI
# All endpoints documented and tested
# Role-based access patterns defined
# Example requests included
```

## 🛠️ Technology Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL (multi-schema)
- **ORM**: Prisma
- **Auth**: JWT
- **Cache**: Redis (for idempotency)
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker

## 📊 Project Structure

```
saas-its/
├── services/
│   ├── identity-svc/     # User authentication & management
│   ├── ticket-svc/       # Ticket & category management
│   ├── asset-svc/        # Asset inventory management
│   └── reservation-svc/  # Equipment reservation system
├── infra/
│   ├── sql/              # Database bootstrap scripts
│   └── terraform/        # Infrastructure as code (planned)
├── docker-compose.yml    # Local development environment
├── Makefile              # Common development tasks
└── docs/                 # Additional documentation
```

## 🔄 Next Steps

### For Frontend Development (Ready Now!)
1. Start all 4 backend services
2. Use Swagger UI for API exploration
3. Reference API documentation for integration
4. Implement frontend using your preferred framework

### For Deployment (Planned)
1. Set up CI/CD pipeline (GitHub Actions)
2. Configure AWS infrastructure (Terraform)
3. Deploy to ECS/EKS
4. Set up monitoring & alerting

### Future Features (Backlog)
- File upload service (S3)
- Email notifications
- Real-time updates (WebSockets)
- Advanced reporting
- Mobile app

## 🧪 Testing

```bash
# Test all services are running
curl http://localhost:3000/v1/health  # Identity
curl http://localhost:3001/v1/health  # Ticket
curl http://localhost:3002/v1/health  # Asset
curl http://localhost:3003/v1/health  # Reservation

# Test ticket creation (public)
curl -X POST http://localhost:3001/v1/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test ticket",
    "type": "incident",
    "priority": "medium",
    "requestedBy": "test@example.com"
  }'

# Test reservation creation (public)
curl -X POST http://localhost:3003/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "requesterEmail": "test@example.com",
    "requesterName": "Test User",
    "requestDate": "2025-10-15T10:00:00Z",
    "returnDate": "2025-10-20T17:00:00Z",
    "items": [{
      "assetTypeId": "550e8400-e29b-41d4-a716-446655440001",
      "assetTypeName": "Laptop",
      "quantity": 1
    }]
  }'
```

## 📞 Support

For questions or issues:
- Check service logs: `/tmp/*-svc.log`
- Review API documentation: `API-DOCUMENTATION.md`
- Check Swagger UI: http://localhost:{port}/docs
- Verify service health: `curl http://localhost:{port}/v1/health`

---

**Status**: ✅ Backend Complete - Ready for Frontend Integration

All 4 microservices are fully functional, documented, and tested. Frontend development can begin immediately using the comprehensive API documentation.
