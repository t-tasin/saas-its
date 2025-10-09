# ⚡ Quick Deploy Checklist

## ☑️ Pre-Deployment (Done!)
- ✅ OTP authentication implemented
- ✅ Email service configured
- ✅ Database schema updated
- ✅ All services have deployment configs
- ✅ Documentation created

## 🚀 Deployment Steps (30-45 min)

### 1. Push to GitHub (2 min)
```bash
git add .
git commit -m "Add OTP auth and deployment config"
git push origin main
```

### 2. Create Railway Account (2 min)
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 3. Deploy Database (5 min)
- Click "+ New Project"
- Add PostgreSQL database
- Note the `DATABASE_URL`

### 4. Deploy Services (20 min, 5 min each)

For each service (identity, ticket, asset, reservation):

```
1. Click "+ New Service"
2. Select GitHub repo
3. Set root directory: `services/[service-name]`
4. Add environment variables:
   - NODE_ENV=production
   - PORT=300X (0,1,2,3)
   - DATABASE_URL=${{Postgres.DATABASE_URL}}
   - JWT_SECRET=<random-secret>
   - JWT_EXPIRES_IN=24h
5. For identity-svc only, add SMTP variables (optional):
   - SMTP_HOST=smtp.gmail.com
   - SMTP_PORT=587
   - SMTP_USER=your-email@gmail.com
   - SMTP_PASS=your-app-password
6. Click "Deploy"
7. Wait for deployment
8. Go to Settings → Networking → Generate Domain
9. Save the URL!
```

### 5. Get Your API URLs (2 min)
Save these from Railway:
```
IDENTITY_API=https://identity-svc-xxx.up.railway.app/v1
TICKET_API=https://ticket-svc-xxx.up.railway.app/v1
ASSET_API=https://asset-svc-xxx.up.railway.app/v1
RESERVATION_API=https://reservation-svc-xxx.up.railway.app/v1
```

### 6. Test APIs (5 min)
```bash
# Test health check
curl https://identity-svc-xxx.up.railway.app/v1/health

# Test OTP request
curl -X POST https://identity-svc-xxx.up.railway.app/v1/auth/otp/request \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 7. Share with V0 (1 min)
Send:
- ✉️ Your 4 API URLs
- 📄 `V0-API-GUIDE.md`
- 💬 "Backend is ready, follow the API guide!"

## 📝 Quick Reference

### Email Setup (Optional)
**Gmail:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
```

**SendGrid:**
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
```

**Development (No Email):**
- Leave SMTP vars empty
- OTP codes logged to Railway console

### Essential Endpoints

**Auth (OTP):**
```
POST /v1/auth/otp/request {"email"}
POST /v1/auth/otp/verify {"email", "code"}
```

**Auth (Password):**
```
POST /v1/auth/register {"email", "password", "name"}
POST /v1/auth/login {"email", "password"}
```

**Tickets:**
```
GET  /v1/tickets
POST /v1/tickets {"title", "description", "type", "priority"}
GET  /v1/categories
```

**Assets:**
```
GET  /v1/assets
POST /v1/assets {"assetTag", "summary"}
```

**Reservations:**
```
GET  /v1/reservations
POST /v1/reservations {"assetTypeId", "startDate", "endDate"}
GET  /v1/availability
```

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check `package.json` has all dependencies |
| Migration fails | Run manually: `railway run npm run prisma:migrate` |
| CORS errors | Add frontend URL to CORS origin list |
| OTP not received | Check Railway logs, verify SMTP credentials |
| 500 errors | Check Railway logs for detailed error |

## 📚 Full Documentation

- **Deployment**: `RAILWAY-DEPLOYMENT.md`
- **API Guide**: `V0-API-GUIDE.md`
- **Summary**: `BACKEND-READY-FOR-DEPLOYMENT.md`

## ⏱️ Time Estimate

- First-time deployment: **30-45 minutes**
- Redeployment (after changes): **5-10 minutes**
- Email setup: **5-10 minutes**

## 💡 Pro Tips

1. Use the **same JWT_SECRET** for all 4 services
2. Enable Railway **auto-deploy** for continuous deployment
3. Use **environment groups** in Railway to share variables
4. Set up **Slack/Discord** notifications for deployments
5. Monitor Railway **metrics** for performance

## ✅ Success Checklist

After deployment:
- [ ] All 4 services show "Deployed" status
- [ ] Health endpoints return 200 OK
- [ ] Can request OTP successfully
- [ ] Can verify OTP and get token
- [ ] Can create ticket (public endpoint)
- [ ] Can access protected endpoint with token
- [ ] Migrations applied (check PostgreSQL)
- [ ] URLs saved and shared with frontend

---

**You're ready to deploy!** Follow these steps and you'll have a production backend in under an hour. 🎉

