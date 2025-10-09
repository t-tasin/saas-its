# API Guide for V0 Frontend Development

## Base URLs (After Deployment)

Replace these with your actual Railway URLs:

```
IDENTITY_API=https://identity-svc.up.railway.app/v1
TICKET_API=https://ticket-svc.up.railway.app/v1
ASSET_API=https://asset-svc.up.railway.app/v1
RESERVATION_API=https://reservation-svc.up.railway.app/v1
```

## Authentication

### Option 1: OTP Authentication (Passwordless - for General Users)

#### Step 1: Request OTP
```typescript
POST ${IDENTITY_API}/auth/otp/request
Content-Type: application/json

{
  "email": "user@example.com"
}

// Response
{
  "message": "OTP sent to your email"
}
```

#### Step 2: Verify OTP and Login
```typescript
POST ${IDENTITY_API}/auth/otp/verify
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}

// Response
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "general",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "uuid"
}
```

### Option 2: Password Authentication (for Operators/Admins)

#### Register
```typescript
POST ${IDENTITY_API}/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "name": "Admin User"
}

// Response
{
  "user": { ... },
  "token": "...",
  "refreshToken": "..."
}
```

#### Login
```typescript
POST ${IDENTITY_API}/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}

// Response
{
  "user": { ... },
  "token": "...",
  "refreshToken": "..."
}
```

### Using the Token

Include the token in all authenticated requests:

```typescript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Tenant-Id: tenant-uuid  // Required for multi-tenant endpoints
```

## Tickets API

### List Tickets
```typescript
GET ${TICKET_API}/tickets?status=open&limit=50
Authorization: Bearer <token>

// Response
{
  "items": [
    {
      "id": "uuid",
      "number": "TICK-00001",
      "title": "Laptop not working",
      "description": "My laptop won't turn on",
      "type": "incident",
      "priority": "high",
      "status": "open",
      "category": { "id": "uuid", "name": "Hardware" },
      "subcategory": { "id": "uuid", "name": "Laptop" },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "base64-cursor" | null
}
```

### Create Ticket (Public - No Auth Required)
```typescript
POST ${TICKET_API}/tickets
Content-Type: application/json

{
  "title": "Printer not working",
  "description": "Office printer is jammed",
  "type": "incident",
  "priority": "medium",
  "requestedBy": "john.doe@company.com",
  "categoryId": "uuid",  // optional
  "subcategoryId": "uuid"  // optional
}

// Response
{
  "id": "uuid",
  "number": "TICK-00002",
  "title": "Printer not working",
  ...
}
```

### Get Ticket
```typescript
GET ${TICKET_API}/tickets/:id
// Public - no auth required

// Response
{
  "id": "uuid",
  "number": "TICK-00001",
  ...
  "comments": [
    {
      "id": "uuid",
      "body": "Comment text",
      "authorName": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update Ticket Status (Operator/Admin Only)
```typescript
PATCH ${TICKET_API}/tickets/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress" // open, in_progress, resolved, closed
}
```

### Add Comment (Public)
```typescript
POST ${TICKET_API}/tickets/:id/comments
Content-Type: application/json

{
  "body": "This is a comment",
  "authorName": "John Doe"  // optional if authenticated
}
```

### List Categories
```typescript
GET ${TICKET_API}/categories
// Public - no auth required

// Response
[
  {
    "id": "uuid",
    "name": "Hardware",
    "subcategories": [
      { "id": "uuid", "name": "Laptop" },
      { "id": "uuid", "name": "Desktop" }
    ]
  }
]
```

## Assets API

### List Assets
```typescript
GET ${ASSET_API}/assets?q=laptop&limit=50
Authorization: Bearer <token>

// Response
{
  "items": [
    {
      "id": "uuid",
      "assetTag": "LAP-001",
      "summary": "Dell Latitude 5420",
      "description": "15.6 inch laptop",
      "status": "available",  // available, in_use, maintenance, retired
      "location": "Office 101",
      "assignedTo": null,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "base64-cursor" | null
}
```

### Create Asset (Operator/Admin Only)
```typescript
POST ${ASSET_API}/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetTag": "LAP-002",
  "summary": "MacBook Pro 16",
  "description": "M1 Pro, 32GB RAM",
  "status": "available",
  "location": "Office 102"
}
```

### Assign Asset (Operator/Admin Only)
```typescript
POST ${ASSET_API}/assets/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedTo": "user@example.com",
  "notes": "Assigned for remote work"
}
```

### Unassign Asset (Operator/Admin Only)
```typescript
POST ${ASSET_API}/assets/:id/unassign
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Returned to office"
}
```

## Reservations API

### List Reservations
```typescript
GET ${RESERVATION_API}/reservations?status=pending&limit=50
Authorization: Bearer <token>

// Response
{
  "items": [
    {
      "id": "uuid",
      "assetType": "Meeting Room A",
      "startDate": "2025-01-15T09:00:00.000Z",
      "endDate": "2025-01-15T11:00:00.000Z",
      "status": "pending",  // pending, approved, denied, active, returned, cancelled
      "purpose": "Team meeting",
      "requestedBy": "user@example.com",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "nextCursor": "base64-cursor" | null
}
```

### Create Reservation
```typescript
POST ${RESERVATION_API}/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetTypeId": "uuid",
  "startDate": "2025-01-15T09:00:00.000Z",
  "endDate": "2025-01-15T11:00:00.000Z",
  "purpose": "Client presentation",
  "requestedBy": "user@example.com"
}
```

### Check Availability
```typescript
GET ${RESERVATION_API}/availability?startDate=2025-01-15T09:00:00.000Z&endDate=2025-01-15T11:00:00.000Z
// Public - no auth required

// Response
[
  {
    "assetTypeId": "uuid",
    "assetTypeName": "Meeting Room A",
    "availableCount": 2,
    "totalCount": 5
  }
]
```

### Approve Reservation (Operator/Admin Only)
```typescript
POST ${RESERVATION_API}/reservations/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Approved for client meeting"
}
```

## User Management API

### Get Current User Profile
```typescript
GET ${IDENTITY_API}/auth/me
Authorization: Bearer <token>

// Response
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "general" | "operator" | "admin",
  "isActive": true,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### List Users (Admin Only)
```typescript
GET ${IDENTITY_API}/users?role=operator&isActive=true
Authorization: Bearer <token>

// Response
[
  {
    "id": "uuid",
    "email": "operator@example.com",
    "name": "Operator Name",
    "role": "operator",
    "isActive": true
  }
]
```

### Create User (Admin Only - for creating operators/admins)
```typescript
POST ${IDENTITY_API}/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newoperator@example.com",
  "password": "SecurePassword123!",
  "name": "New Operator",
  "role": "operator"  // operator | admin
}
```

## Error Handling

All APIs return errors in this format:

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR" | "UNAUTHORIZED" | "NOT_FOUND" | "CONFLICT" | "INTERNAL_ERROR",
    "message": "Human-readable error message"
  }
}
```

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

## Frontend Implementation Example

```typescript
// api.ts
const API_BASE = {
  identity: process.env.NEXT_PUBLIC_IDENTITY_API,
  ticket: process.env.NEXT_PUBLIC_TICKET_API,
  asset: process.env.NEXT_PUBLIC_ASSET_API,
  reservation: process.env.NEXT_PUBLIC_RESERVATION_API,
};

// Get auth token from localStorage/cookies
const getAuthToken = () => localStorage.getItem('token');

// Generic API call
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API Error');
  }

  return response.json();
}

// Example: Request OTP
export async function requestOTP(email: string) {
  return apiCall(`${API_BASE.identity}/auth/otp/request`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Example: Verify OTP
export async function verifyOTP(email: string, code: string) {
  const data = await apiCall(`${API_BASE.identity}/auth/otp/verify`, {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
  
  // Save token
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  return data;
}

// Example: Get tickets
export async function getTickets(params?: { status?: string; limit?: number }) {
  const query = new URLSearchParams(params as any).toString();
  return apiCall(`${API_BASE.ticket}/tickets?${query}`);
}

// Example: Create ticket
export async function createTicket(ticket: CreateTicketDto) {
  return apiCall(`${API_BASE.ticket}/tickets`, {
    method: 'POST',
    body: JSON.stringify(ticket),
  });
}
```

## Role-Based UI Access

### General Users Can:
- ✅ Login with OTP
- ✅ View and create tickets
- ✅ Add comments to tickets
- ✅ Create reservations
- ✅ View their own profile
- ❌ CANNOT see dashboard
- ❌ CANNOT manage users
- ❌ CANNOT approve reservations

### Operators Can:
- ✅ Everything general users can do
- ✅ Update ticket status
- ✅ Manage assets
- ✅ Approve/deny reservations
- ✅ See dashboard
- ❌ CANNOT create other operators/admins

### Admins Can:
- ✅ Everything operators can do
- ✅ Create users (operators/admins)
- ✅ Deactivate users
- ✅ Full system access

## Next Steps

1. Deploy backend to Railway using `RAILWAY-DEPLOYMENT.md`
2. Get your API URLs from Railway
3. Update V0 environment variables with API URLs
4. Implement authentication flow in frontend
5. Add role-based navigation guards
6. Test all API endpoints

## Support

If you encounter issues:
1. Check Railway logs for backend errors
2. Verify environment variables are set correctly
3. Ensure CORS is configured for your frontend URL
4. Check network tab for API call details

