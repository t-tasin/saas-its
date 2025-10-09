# 🚀 Quick Deploy Guide - Railway

## What Was Fixed

✅ **Prisma Binary Target Issue** - Added `debian-openssl-3.0.x` to all schema.prisma files  
✅ **Postinstall Hook Added** - Railway now auto-generates Prisma client during npm install  
✅ **All package.json files updated** - Added `"postinstall": "prisma generate"` to all services  
✅ **TypeScript compilation successful** - No errors

### The Critical Fix
Railway wasn't generating the Prisma client because the `generated/` folder is gitignored. By adding a `postinstall` hook, Railway now automatically runs `prisma generate` after `npm install`, creating the Linux binary it needs!

---

## Deploy in 3 Steps

### Step 1: Commit Changes (30 seconds)

```bash
git add .
git commit -m "Fix Prisma deployment for Railway

- Add debian-openssl-3.0.x to all schema.prisma files
- Add postinstall hook to auto-generate Prisma client
- Ensures Linux binary is generated during Railway build"

git push origin main
```

### Step 2: Railway Auto-Deploys (2-5 minutes)

Railway will automatically:
1. Detect your GitHub push
2. Pull the latest code
3. Build all services
4. Deploy them

**Monitor at:** https://railway.app/dashboard

### Step 3: Get Your Service URLs

Once deployed, Railway provides URLs like:
```
https://identity-svc-production-xxxx.up.railway.app
https://ticket-svc-production-xxxx.up.railway.app
https://asset-svc-production-xxxx.up.railway.app
https://reservation-svc-production-xxxx.up.railway.app
```

Copy these to share with your V0 frontend team!

---

## Quick Test (After Deployment)

```bash
# Replace with your actual Railway URLs
curl https://identity-svc-production-xxxx.up.railway.app/v1/health
curl https://ticket-svc-production-xxxx.up.railway.app/v1/health
curl https://asset-svc-production-xxxx.up.railway.app/v1/health
curl https://reservation-svc-production-xxxx.up.railway.app/v1/health
```

Expected response: `{"status":"ok"}`

---

## Environment Variables Already Set?

Make sure each Railway service has:
- `DATABASE_URL` - PostgreSQL connection string
- `SHADOW_DATABASE_URL` - Shadow database for migrations
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret for refresh tokens
- `NODE_ENV` - Set to `production`
- `PORT` - Railway auto-sets this to `8080`

For OTP emails (optional for now):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

---

## Troubleshooting

### If deployment fails:

1. **Check Railway logs** in the dashboard
2. **Look for Prisma errors** - Should now show Linux binary loading successfully
3. **Database connection** - Make sure DATABASE_URL is set
4. **Redis warnings** - Safe to ignore (non-blocking)

### Common Issues:

**Issue:** Database connection failed  
**Fix:** Check `DATABASE_URL` environment variable

**Issue:** Port already in use  
**Fix:** Railway handles ports automatically, this shouldn't happen

**Issue:** Build timeout  
**Fix:** Railway builds can take 3-5 minutes for first deploy

---

## After Successful Deployment

### Share with V0 Frontend Team:

**API URLs:** (Get from Railway dashboard)
```
Identity:    https://identity-svc-production-xxxx.up.railway.app
Tickets:     https://ticket-svc-production-xxxx.up.railway.app
Assets:      https://asset-svc-production-xxxx.up.railway.app
Reservations: https://reservation-svc-production-xxxx.up.railway.app
```

**API Documentation:**
- `API-DOCUMENTATION.md` - General API docs
- `V0-API-GUIDE.md` - Specific guide for V0 team
- `ANALYTICS-API.md` - Analytics endpoints
- `RESERVATION-API.md` - Reservation system

**Authentication:**
- OTP for general users: `POST /v1/auth/otp/request` and `/v1/auth/otp/verify`
- Password for operators/admins: `POST /v1/auth/login`

---

## That's It!

You're ready to deploy. Just run the commit commands and Railway does the rest!

**Need help?** Check `RAILWAY-FIX-SUMMARY.md` for detailed technical information.

