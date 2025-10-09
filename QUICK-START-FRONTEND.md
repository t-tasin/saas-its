# Quick Start: Frontend Development

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Backend is Running

```bash
# Check all services are up
curl http://localhost:3000/v1/health  # Identity ✅
curl http://localhost:3001/v1/health  # Ticket ✅
curl http://localhost:3002/v1/health  # Asset ✅
curl http://localhost:3003/v1/health  # Reservation ✅
```

### Step 2: Create Frontend Project

```bash
# Navigate to workspace
cd /Users/tasin/Desktop/Codebase.nosync/saas-its

# Create Next.js app
npx create-next-app@latest web/apps/helpdesk-ui --typescript --tailwind --app --no-src-dir

# Navigate to project
cd web/apps/helpdesk-ui
```

### Step 3: Install Dependencies

```bash
npm install axios @tanstack/react-query recharts react-hook-form zod date-fns react-hot-toast
```

### Step 4: Set Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_IDENTITY_API=http://localhost:3000/v1
NEXT_PUBLIC_TICKET_API=http://localhost:3001/v1
NEXT_PUBLIC_ASSET_API=http://localhost:3002/v1
NEXT_PUBLIC_RESERVATION_API=http://localhost:3003/v1
```

### Step 5: Use AI to Build

#### Option A: v0.dev
1. Go to https://v0.dev
2. Paste this prompt:
```
Build a complete IT Helpdesk frontend using Next.js, TypeScript, and Tailwind CSS.

Requirements:
- Next.js App Router
- 13 pages: Home, Login, Register, Tickets, Reservations, Dashboard, Analytics, etc.
- Authentication with JWT (localStorage)
- Role-based access: General (public), Operator, Admin
- Analytics dashboard with charts (Recharts)
- CRUD for tickets, reservations, assets

Backend APIs:
- Identity: http://localhost:3000/v1
- Ticket: http://localhost:3001/v1
- Asset: http://localhost:3002/v1
- Reservation: http://localhost:3003/v1

Full specification: [Paste FRONTEND-SPECIFICATION.md contents]
```

#### Option B: Cursor AI
1. Open project in Cursor
2. Reference `FRONTEND-SPECIFICATION.md`
3. Ask Cursor:
```
Based on FRONTEND-SPECIFICATION.md, create:
1. Component library in /components
2. API services in /lib/api
3. Pages in /app
4. Auth context in /contexts
5. Hooks in /hooks

Start with the authentication flow.
```

---

## 📋 Build Checklist

### Phase 1: Core Setup (30 min)
- [ ] Create Next.js project
- [ ] Install dependencies
- [ ] Set up Tailwind config
- [ ] Create folder structure
- [ ] Add environment variables

### Phase 2: Components (1 hour)
- [ ] Layout components (AppLayout, Navbar, Sidebar)
- [ ] Form components (Input, Select, Button)
- [ ] Data display (Card, Table, Badge)
- [ ] Feedback (Alert, Modal, Loading)

### Phase 3: Authentication (1 hour)
- [ ] Auth context
- [ ] Login page
- [ ] Register page
- [ ] Protected routes
- [ ] API interceptors

### Phase 4: Public Pages (2 hours)
- [ ] Home page
- [ ] Create ticket page
- [ ] Ticket list page
- [ ] Ticket detail page
- [ ] Create reservation page
- [ ] Reservation list page

### Phase 5: Dashboard (3 hours)
- [ ] Main dashboard
- [ ] Ticket management
- [ ] Reservation management
- [ ] Asset management
- [ ] Analytics page with charts

### Phase 6: Polish (1 hour)
- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Responsive design
- [ ] Testing

**Total Time: ~8 hours for complete frontend**

---

## 🎨 Key Code Snippets

### API Client Setup

```tsx
// lib/api/client.ts
import axios from 'axios';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Auth Context

```tsx
// contexts/AuthContext.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('http://localhost:3000/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Example Page: Login

```tsx
// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Example API Hook

```tsx
// hooks/useTickets.ts
import { useQuery } from '@tanstack/react-query';

export const useTickets = () => {
  return useQuery(['tickets'], async () => {
    const res = await fetch('http://localhost:3001/v1/tickets');
    return res.json();
  });
};
```

---

## 🧪 Test Your Integration

### 1. Test Login
```bash
# Create a test user
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User",
    "role": "operator"
  }'
```

### 2. Test Ticket Creation
```bash
# Create a ticket (public, no auth)
curl -X POST http://localhost:3001/v1/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket",
    "type": "incident",
    "priority": "medium",
    "requestedBy": "test@example.com"
  }'
```

### 3. Test Analytics (requires auth)
```bash
# Get ticket analytics
curl http://localhost:3001/v1/analytics/tickets \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📚 Documentation Reference

- **Complete Spec**: `FRONTEND-SPECIFICATION.md` (800+ lines)
- **API Reference**: `API-DOCUMENTATION.md`
- **Analytics**: `ANALYTICS-API.md`
- **Deployment**: `DEPLOYMENT-GUIDE.md`

---

## 🎯 Success Criteria

Your frontend is complete when:
- ✅ Users can submit tickets without login
- ✅ Users can request reservations without login
- ✅ Operators can login and manage tickets/reservations
- ✅ Admins see analytics dashboard with charts
- ✅ All CRUD operations work
- ✅ Responsive on mobile and desktop
- ✅ Error handling and loading states present

---

## 💡 Tips

1. **Use Swagger UI** (http://localhost:3001/docs) to test APIs before coding
2. **Start with auth** - get login working first
3. **Build incrementally** - one page at a time
4. **Copy examples** - all docs have code samples
5. **Test often** - verify each feature before moving on

---

**Ready to build? The backend is waiting! 🚀**

