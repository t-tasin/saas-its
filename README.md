# SaaS IT Service Management Platform

A cloud-native microservices-based IT Service Management (ITSM) platform built with modern technologies.

## 🏗️ Architecture

**Microservices:**
- **Identity Service** - Authentication, authorization, and user management
- **Ticket Service** - IT ticket management with file attachments
- **Asset Service** - IT asset tracking and inventory management
- **Reservation Service** - Equipment reservation and booking

**Tech Stack:**
- **Backend**: NestJS (Node.js + TypeScript)
- **Frontend**: Next.js + React + TypeScript
- **Database**: PostgreSQL (Multi-tenant with Prisma ORM)
- **Deployment**: Railway (Docker containers)
- **Storage**: AWS S3 (File attachments)
- **Email**: SendGrid (OTP & notifications)

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- OTP (One-Time Password) email verification
- Role-Based Access Control (RBAC)
  - **General User**: Create tickets, view own assets
  - **Operator**: Manage tickets, assign resources
  - **Admin**: Full system access

### IT Ticket Management
- Multi-channel ticket creation
- Priority-based workflow
- Status tracking (open → in_progress → resolved → closed)
- File attachments (AWS S3)
- Comment threads
- SLA tracking
- Category/subcategory organization

### Asset Management
- Comprehensive asset tracking (25+ fields)
- Assignment tracking
- Lifecycle management
- Asset types and categorization
- Search and filtering
- Audit logging

### Equipment Reservation
- Resource booking system
- Availability checking
- Approval workflow
- Calendar integration
- Auto-reminders

### Analytics
- Ticket metrics (resolution time, SLA compliance)
- Asset utilization
- Reservation trends
- Custom dashboards

## 📊 API Documentation

Each service exposes OpenAPI (Swagger) documentation:

**Production URLs:**
- Identity: `https://[identity-url].railway.app/api`
- Ticket: `https://[ticket-url].railway.app/api`
- Asset: `https://[asset-url].railway.app/api`
- Reservation: `https://[reservation-url].railway.app/api`

## 🔐 Security

- HTTPS encryption on all endpoints
- JWT token authentication
- Environment-based secrets management
- Rate limiting on sensitive endpoints
- SQL injection prevention (Prisma ORM)
- CORS configuration
- Input validation with class-validator

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- AWS Account (for S3)
- SendGrid Account (for email)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd saas-its
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   - Contact project maintainer for `.env` files
   - Or refer to internal deployment documentation

4. **Run database migrations**
   ```bash
   cd services/identity-svc && npx prisma migrate dev
   cd ../ticket-svc && npx prisma migrate dev
   cd ../asset-svc && npx prisma migrate dev
   cd ../reservation-svc && npx prisma migrate dev
   ```

5. **Start services**
   ```bash
   # From root directory
   npm run dev
   ```

### Deployment

**Automatic Deployment:**
- Push to `main` branch → Auto-deploys to Railway
- Each service is containerized with Docker
- Zero-downtime deployments with health checks

**Manual Deployment:**
- Refer to internal deployment documentation
- Contact DevOps team

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific service
cd services/identity-svc && npm test

# Integration tests
npm run test:e2e
```

## 📈 Monitoring

- **Health Checks**: `/v1/health` on each service
- **Logs**: Available in Railway dashboard
- **Metrics**: Track via Railway Metrics tab
- **Alerts**: Configured via UptimeRobot

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
5. Wait for code review

**Coding Standards:**
- ESLint + Prettier
- TypeScript strict mode
- Follow existing patterns
- Write meaningful commit messages

## 📝 License

Proprietary - All rights reserved

## 👥 Team

Developed by [Your Team Name]

## 🆘 Support

For issues or questions:
- Create an issue in the project tracker
- Contact: [support email]
- Internal docs: [documentation portal]

---

**Note:** Detailed deployment guides, API specifications, and architecture documents are available in the internal documentation portal (not in this repository).

## 🎯 Project Metrics

- **4 Microservices** in production
- **40+ API Endpoints** across all services
- **99.9% Uptime** target
- **<200ms** average API response time
- **Multi-tenant** architecture
- **Auto-scaling** enabled

## 🔄 CI/CD Pipeline

- **Source Control**: GitHub
- **Container Registry**: Railway (Docker)
- **Deployment**: Automatic on push to main
- **Rollback**: Automatic on health check failure

---

**Built with ❤️ using modern cloud-native technologies**
