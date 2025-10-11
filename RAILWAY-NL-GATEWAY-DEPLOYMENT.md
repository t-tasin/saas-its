# Railway Deployment Guide for NL Gateway

## 🚀 Quick Deploy to Railway

### Step 1: Create New Service in Railway

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"GitHub Repo"**
3. Select your `saas-its` repository
4. Railway will detect the monorepo structure

### Step 2: Configure the Service

**Service Name:** `nl-gateway`

**Build Settings:**
- **Root Directory:** `services/nl-gateway`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Or use nixpacks.toml:**

Create `services/nl-gateway/nixpacks.toml`:
```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### Step 3: Set Environment Variables

Add these environment variables in Railway Dashboard:

```bash
# LLM Provider
LLM_PROVIDER=groq

# Groq Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# Ticket Service URL (use your Railway internal URL or public URL)
TICKET_BASE=${{ticket-svc.RAILWAY_PUBLIC_DOMAIN}}/v1
# OR use public URL:
# TICKET_BASE=https://saas-itsticket-svc-production.up.railway.app/v1

# Service Configuration
PORT=3100
CATEGORIES_TTL=120000
LOG_LEVEL=info
NODE_ENV=production
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Railway will automatically assign a public URL

### Step 5: Test Your Deployment

Once deployed, test the health endpoint:

```bash
curl https://your-nl-gateway-url.up.railway.app/healthz
# Should return: {"ok":true}
```

Test ticket creation:

```bash
curl -X POST https://your-nl-gateway-url.up.railway.app/nl/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "text": "My laptop is overheating! Very urgent!",
    "fallback": {
      "name": "Test User",
      "email": "test@example.com"
    }
  }'
```

## 📝 Environment Variable Details

| Variable | Value | Description |
|----------|-------|-------------|
| `LLM_PROVIDER` | `groq` | Which LLM to use |
| `GROQ_API_KEY` | `gsk_...` | Your Groq API key |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Model name (NOT `instruct`) |
| `TICKET_BASE` | `https://...` | Your ticket-svc URL |
| `PORT` | `3100` | Service port |
| `CATEGORIES_TTL` | `120000` | Cache duration (ms) |
| `LOG_LEVEL` | `info` | Log verbosity |
| `NODE_ENV` | `production` | Environment |

## 🔗 Service Dependencies

The nl-gateway needs to communicate with:

1. **ticket-svc** - To create tickets
   - Use Railway's internal networking: `${{ticket-svc.RAILWAY_PUBLIC_DOMAIN}}`
   - Or use public URL: `https://saas-itsticket-svc-production.up.railway.app`

2. **Groq API** - For LLM processing
   - Requires API key
   - No firewall configuration needed

## 🔧 Recommended Railway Settings

**Resources:**
- **Memory:** 512 MB (minimum)
- **CPU:** Shared (default)
- **Replicas:** 1

**Networking:**
- Enable public networking
- Note the assigned Railway URL

**Health Checks:**
- Path: `/healthz`
- Port: `3100`
- Interval: 30s

## 📊 Monitoring

After deployment, monitor:

1. **Logs** - Check Railway logs for:
   - Service startup confirmation
   - LLM API calls
   - Ticket creation requests
   - Any errors or warnings

2. **Metrics** - Watch:
   - Response times
   - Memory usage
   - Error rates

## 🐛 Troubleshooting

### Issue: Service won't start

**Check:**
- ✅ Root directory is set to `services/nl-gateway`
- ✅ All environment variables are set
- ✅ `GROQ_MODEL` is `llama-3.1-8b-instant` (NOT `instruct`)

### Issue: Ticket creation fails

**Check:**
- ✅ `TICKET_BASE` URL is correct and accessible
- ✅ ticket-svc is running
- ✅ Groq API key is valid

### Issue: Categories error

**This is expected if you haven't seeded categories yet.**
- The service will work fine without categories
- Categories are optional for ticket creation

## 🔄 Update Existing Services

No changes needed! The nl-gateway is standalone:
- ✅ ticket-svc unchanged
- ✅ identity-svc unchanged
- ✅ asset-svc unchanged
- ✅ reservation-svc unchanged

## 📱 Frontend Integration (Next Steps)

Once deployed, update your frontend to use nl-gateway:

1. Add a textarea for natural language input
2. Call `POST /nl/tickets` with the text
3. Display the created ticket

Example:
```typescript
const response = await fetch('https://your-nl-gateway.railway.app/nl/tickets', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: userInput,
    fallback: { name: userName, email: userEmail }
  })
});
```

## ✅ Deployment Checklist

- [ ] Service created in Railway
- [ ] Root directory set to `services/nl-gateway`
- [ ] All environment variables configured
- [ ] `GROQ_MODEL` is `llama-3.1-8b-instant`
- [ ] `TICKET_BASE` points to ticket-svc
- [ ] Service deployed successfully
- [ ] Health check passing (`/healthz` returns `{"ok":true}`)
- [ ] Test ticket creation working
- [ ] Public URL noted for frontend integration

## 🎉 You're Done!

Your NL Gateway is now deployed and ready to convert natural language into structured tickets!

**Service URL Format:** `https://nl-gateway-production-XXXX.up.railway.app`

Remember to update your frontend to use this new service! 🚀

