# Railway.app Deployment Guide

This guide explains how to deploy the SaaS ITS backend to Railway.app.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Repository**: Push this code to GitHub
3. **Railway CLI** (optional): `npm install -g @railway/cli`

## Overview

We'll deploy:
- 1x PostgreSQL database
- 4x Node.js services:
  - `identity-svc` (port 3000)
  - `ticket-svc` (port 3001)
  - `asset-svc` (port 3002)
  - `reservation-svc` (port 3003)

## Step 1: Create Railway Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select this repository

## Step 2: Add PostgreSQL Database

1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL instance
4. Note the connection details (will be available as `DATABASE_URL`)

## Step 3: Deploy Identity Service

1. Click "+ New" → "GitHub Repo"
2. Configure:
   - **Root Directory**: `services/identity-svc`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run prisma:migrate && npm run start`
   
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<generate-random-secret>
   JWT_EXPIRES_IN=24h
   
   # Email (Optional - for OTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM="SaaS ITS <noreply@saas-its.com>"
   ```

4. Click "Deploy"

## Step 4: Deploy Ticket Service

1. Click "+ New" → "GitHub Repo"
2. Configure:
   - **Root Directory**: `services/ticket-svc`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run prisma:migrate && npm run start`
   
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<same-as-identity-svc>
   JWT_EXPIRES_IN=24h
   ```

4. Click "Deploy"

## Step 5: Deploy Asset Service

1. Click "+ New" → "GitHub Repo"
2. Configure:
   - **Root Directory**: `services/asset-svc`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run prisma:migrate && npm run start`
   
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3002
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<same-as-identity-svc>
   JWT_EXPIRES_IN=24h
   ```

4. Click "Deploy"

## Step 6: Deploy Reservation Service

1. Click "+ New" → "GitHub Repo"
2. Configure:
   - **Root Directory**: `services/reservation-svc`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run prisma:migrate && npm run start`
   
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=3003
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<same-as-identity-svc>
   JWT_EXPIRES_IN=24h
   ```

4. Click "Deploy"

## Step 7: Generate Public URLs

1. For each service, go to **Settings** → **Networking**
2. Click "Generate Domain"
3. Railway will create a public URL like `https://your-service-name.up.railway.app`

## Step 8: Update CORS Configuration

1. Note all 4 public URLs
2. Update `main.ts` in each service to include the frontend URL:
   ```typescript
   app.enableCors({
     origin: [
       'http://localhost:3000',
       'http://localhost:3004',
       'https://your-frontend-url.vercel.app', // Add your V0 frontend URL
     ],
     // ... rest of config
   });
   ```

## Step 9: Seed Database (Optional)

1. Click on identity-svc
2. Go to "Variables" tab
3. Click "New Variable"
4. Run seed script via Railway CLI:
   ```bash
   railway run npm run seed
   ```

## Your API URLs

After deployment, you'll have:

- **Identity Service**: `https://identity-svc.up.railway.app/v1`
- **Ticket Service**: `https://ticket-svc.up.railway.app/v1`
- **Asset Service**: `https://asset-svc.up.railway.app/v1`
- **Reservation Service**: `https://reservation-svc.up.railway.app/v1`

## Example API Endpoints

### Identity Service
```
POST https://identity-svc.up.railway.app/v1/auth/otp/request
POST https://identity-svc.up.railway.app/v1/auth/otp/verify
POST https://identity-svc.up.railway.app/v1/auth/login
POST https://identity-svc.up.railway.app/v1/auth/register
GET  https://identity-svc.up.railway.app/v1/auth/me
```

### Ticket Service
```
GET  https://ticket-svc.up.railway.app/v1/tickets
POST https://ticket-svc.up.railway.app/v1/tickets
GET  https://ticket-svc.up.railway.app/v1/categories
```

### Asset Service
```
GET  https://asset-svc.up.railway.app/v1/assets
POST https://asset-svc.up.railway.app/v1/assets
```

### Reservation Service
```
GET  https://reservation-svc.up.railway.app/v1/reservations
POST https://reservation-svc.up.railway.app/v1/reservations
GET  https://reservation-svc.up.railway.app/v1/availability
```

## Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` is correctly set in all services
- Check that PostgreSQL database is running
- Verify network settings allow connections

### Build Failures
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Prisma schema is valid

### Migration Issues
- Run migrations manually via Railway CLI
- Check database schema matches Prisma schema
- Ensure `prisma:migrate` script exists in `package.json`

## Cost Estimation

Railway free tier includes:
- $5 of usage per month
- Suitable for development/testing
- Each service ~$1-2/month
- PostgreSQL ~$2-3/month

Total estimated cost: **$8-12/month** (or free for small traffic)

## Alternative: Render.com

If you prefer Render:
1. Similar process
2. Free PostgreSQL database
3. Free tier for each service
4. Slightly slower cold starts

## Next Steps

1. ✅ Deploy all services
2. ✅ Test API endpoints
3. ✅ Configure email SMTP
4. ✅ Share API URLs with frontend team
5. ✅ Set up monitoring (optional)
6. ✅ Configure custom domain (optional)

