# 🔧 Asset & Reservation Service Fix

## ❌ Errors You're Seeing

### **Asset Service**: 401 Unauthorized
```
GET http://localhost:3001/api/assets/assets 401 (Unauthorized)
error: { ... }, path: '/v1/assets'
```

### **Reservation Service**: 400 Bad Request  
```
POST http://localhost:3001/api/reservations/reservations 400 (Bad Request)
```

---

## ✅ **Fixes Applied**

### **1. Asset Controller Routing** ✅ 
**Problem:** Controller was missing `/assets` prefix  
**Fix:** Added `@Controller('/assets')` to match expected `/v1/assets` path  
**Status:** ✅ Fixed and pushed to GitHub

### **2. Asset Service 401 Error** ⏳
**Problem:** Missing `DEV_MODE=true` in Railway  
**Fix:** You need to add this environment variable

---

## 🚀 **Action Required: Fix Railway**

### **Asset Service - Add DEV_MODE**

1. Go to Railway Dashboard: https://railway.app/dashboard
2. Find **asset-svc** service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add:
   ```
   DEV_MODE=true
   ```
6. Click **Save**
7. Railway will auto-redeploy (~2 minutes)

**Why:** Your backend uses HMAC-signed tokens (not full JWTs), so `DEV_MODE=true` tells the backend to accept these tokens.

---

## ✅ **Verification Steps**

### **After Railway Deploys Asset Service:**

1. **Test Backend Directly:**
   ```bash
   curl "https://saas-itsasset-svc-production.up.railway.app/v1/assets" \
     -H "Authorization: Bearer test"
   ```
   
   **Expected:** Should return `{ "items": [...], "nextCursor": ... }`  
   **Not:** 401 Unauthorized

2. **Test Frontend:**
   - Refresh your browser
   - Navigate to **Asset Management** page
   - Assets should load successfully

3. **Test Reservation:**
   - Navigate to **Reservation Management** page
   - Should display existing reservations
   - Try creating a new reservation

---

## 🐛 **Still Getting Errors?**

### **Asset Service Still 401:**
Check Railway logs:
```
railway logs --service asset-svc
```

Look for:
- `DEV_MODE=true` in startup logs
- `✅ Asset Service running on port 3000`
- Any JWT validation errors

### **Reservation 400 Bad Request:**
Check backend logs for specific validation error:
```
railway logs --service reservation-svc
```

Common causes:
- Missing required fields (`equipmentType`, `requestDate`, `returnDate`)
- Invalid date format (must be ISO 8601: `2025-10-15T12:00:00Z`)
- `requestDate` in the past
- `returnDate` before `requestDate`
- Duration > 14 days

---

## 📋 **Complete Railway Environment Variables**

### **All Services Need:**
```bash
# Required for HMAC token validation
DEV_MODE=true

# Database
DATABASE_URL=postgresql://...?schema=<service_schema>
SHADOW_DATABASE_URL=postgresql://...?schema=<service_schema>_shadow

# JWT (same across all services)
JWT_SECRET=your-secret-key

# Service Port
PORT=3000
```

### **Additionally for Ticket Service:**
```bash
# For S3 attachments (optional)
NODE_ENV=production
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalr...
AWS_S3_BUCKET=saas-its-attachments
```

---

## 🎉 **Expected Result**

After fixing Railway `DEV_MODE`:

✅ **Asset Management Page**
- Lists all assets
- Can create new assets
- Can assign/unassign assets
- Shows asset types and statuses

✅ **Reservation Management Page**
- Lists all reservations
- Can create new reservations
- Can approve/deny (as admin/operator)
- Shows equipment availability

---

## 💡 **Pro Tip**

To avoid 401 errors in the future, make sure **all** Railway services have:
```bash
DEV_MODE=true
```

This is required because your identity service generates simple HMAC tokens, not full JWTs with JWKS.

---

## 📞 **Need Help?**

If assets/reservations still don't work after adding `DEV_MODE=true`:

1. Check Railway deployment status
2. Share the Railway logs
3. Check browser console for detailed error messages

