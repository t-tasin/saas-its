# E2E Test Execution Instructions

## ⚠️ Current Status

All Railway services are returning **502 Bad Gateway** errors. The services need to be healthy before E2E tests can run.

## 🔍 Service Health Check

Run this command to check all services:
```bash
curl https://saas-itsidentity-svc-production.up.railway.app/v1/health
curl https://saas-itsticket-svc-production.up.railway.app/v1/health
curl https://asset-svc-production.up.railway.app/v1/health
curl https://saas-itsreservation-svc-production.up.railway.app/v1/health
```

Expected response: `200 OK` with `{"status":"ok"}`

## 🛠️ Prerequisites

Before running E2E tests, ensure:

1. ✅ All 4 services are deployed and healthy on Railway
2. ✅ Services return `200 OK` on health endpoints
3. ✅ Database (Neon) is accessible
4. ✅ Environment variables are correctly set
5. ✅ Redis errors are resolved (optional, but recommended)

## 📋 Running E2E Tests

### Step 1: Verify Services are Running

Check Railway dashboard or run:
```bash
npm run test:e2e:auth 2>&1 | head -20
```

If you see **502 errors**, services are down. Check Railway logs:
1. Go to Railway dashboard
2. Check each service's deploy logs
3. Look for errors (especially Redis connection errors)

### Step 2: Fix Service Issues

Common issues and fixes:

#### Issue: Redis Connection Errors
**Solution**: Services are already configured to gracefully handle Redis unavailability. If services are still crashing:
- Check if `REDIS_URL` is set (it's optional)
- Or remove Redis dependency temporarily

#### Issue: Database Connection Errors
**Solution**: Verify Neon connection string:
- Check `DATABASE_URL` in Railway environment variables
- Test connection: `psql 'postgresql://neondb_owner:...@ep-divine-art...`

#### Issue: Missing Environment Variables
**Solution**: Check Railway variables against `.railway.env.example`

### Step 3: Run E2E Tests

Once services are healthy (200 OK on `/v1/health`):

```bash
# Run all E2E tests
npm run test:e2e

# Or run individual test suites
npm run test:e2e:auth           # Authentication flow
npm run test:e2e:ticket         # Ticket lifecycle
npm run test:e2e:asset          # Asset management
npm run test:e2e:reservation    # Reservation workflow
npm run test:e2e:workflow       # Complete end-to-end workflow
```

## 📊 Expected Test Results

### Authentication Tests (11 tests)
- ✅ User registration (general, operator, admin)
- ✅ Login with password
- ✅ Two-factor authentication (OTP)
- ✅ Token refresh
- ✅ Profile management
- ✅ Password change

### Ticket Tests (10 tests)
- ✅ Create, list, filter tickets
- ✅ Get ticket details
- ✅ Assign to operator
- ✅ Update status (resolved, closed)
- ✅ Add comments
- ✅ S3 attachments (upload/download URLs)

### Asset Tests (9 tests)
- ✅ Create, list, filter assets
- ✅ Assign/unassign to users
- ✅ Get user's assets
- ✅ Update asset details
- ✅ Asset analytics
- ✅ Delete asset

### Reservation Tests (9 tests)
- ✅ Check equipment availability
- ✅ Create, list, filter reservations
- ✅ Approve/deny workflow
- ✅ Activate reservation
- ✅ Return equipment
- ✅ Cancel reservation

### Complete Workflow Test (14 tests)
- ✅ End-to-end integration across all services
- ✅ User registration → Asset assignment → Ticket creation → Reservation workflow
- ✅ Cross-service analytics
- ✅ Cleanup flow

**Total: 50+ E2E tests**

## 🐛 Troubleshooting

### 502 Bad Gateway
**Cause**: Service is not running or crashed
**Fix**: 
1. Check Railway deploy logs
2. Restart service in Railway dashboard
3. Verify environment variables
4. Check database connectivity

### 401 Unauthorized
**Cause**: Invalid or expired token
**Fix**: 
- E2E tests create new users for each run
- Ensure `/v1/auth/register` and `/v1/auth/login` endpoints work

### 404 Not Found
**Cause**: Wrong URL or service path
**Fix**:
- Verify service URLs in `test/e2e-config.ts`
- Ensure all services have `/v1` prefix
- Check Railway service URLs

### Timeout Errors
**Cause**: Service is slow or database query is hanging
**Fix**:
- Increase timeout in `jest-e2e.config.js` (currently 60s)
- Check database performance
- Verify network connectivity

## 📝 Test Configuration

E2E test configuration is in `test/e2e-config.ts`:

```typescript
export const E2E_CONFIG = {
  IDENTITY_URL: 'https://saas-itsidentity-svc-production.up.railway.app',
  TICKET_URL: 'https://saas-itsticket-svc-production.up.railway.app',
  ASSET_URL: 'https://asset-svc-production.up.railway.app',
  RESERVATION_URL: 'https://saas-itsreservation-svc-production.up.railway.app',
};
```

Update these URLs if your Railway service URLs are different.

## ✅ Success Criteria

E2E tests are successful when:
1. ✅ All services return 200 OK on health endpoints
2. ✅ All test suites pass (50+ tests)
3. ✅ No network or timeout errors
4. ✅ Test data is created and cleaned up correctly

## 📈 Next Steps After Tests Pass

1. **Document Results**
   - Save test output to `E2E-TEST-RESULTS.md`
   - Screenshot passing tests

2. **Update Metrics**
   - Add to `PROJECT-METRICS.md`
   - "50+ E2E tests covering all microservices"
   - "100% API endpoint coverage"

3. **Frontend Integration**
   - Use test results to validate frontend integration
   - Reference `FRONTEND-INTEGRATION-GUIDE.md`

4. **CI/CD Integration** (Optional)
   - Add E2E tests to GitHub Actions
   - Run on every deployment

---

**Created**: 2025-10-10
**Status**: Waiting for services to be healthy
**Test Coverage**: 94 tests (44 unit + 50 E2E)

