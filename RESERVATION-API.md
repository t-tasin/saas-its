# Reservation Service & Categories API Documentation

## 📋 Ticket Categories & Subcategories

### List All Categories (Public)
```http
GET /v1/categories

Response:
[
  {
    "id": "uuid",
    "name": "Hardware Issues",
    "createdAt": "2025-10-09T15:00:00.000Z",
    "subcategories": [
      {
        "id": "uuid",
        "categoryId": "parent-uuid",
        "name": "Laptop",
        "createdAt": "2025-10-09T15:00:00.000Z"
      }
    ]
  }
]
```

### Get Single Category (Public)
```http
GET /v1/categories/:id

Response: Category object with subcategories array
```

### Create Category (Operator/Admin)
```http
POST /v1/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Hardware Issues"
}

Response: Created category object
```

### Update Category (Operator/Admin)
```http
PATCH /v1/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Hardware Problems"
}

Response: Updated category object
```

### Delete Category (Admin Only)
```http
DELETE /v1/categories/:id
Authorization: Bearer {token}

Response:
{
  "message": "Category deleted successfully"
}
```

### List Subcategories for Category (Public)
```http
GET /v1/categories/:id/subcategories

Response: Array of subcategory objects
```

### Create Subcategory (Operator/Admin)
```http
POST /v1/categories/:id/subcategories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Laptop"
}

Response: Created subcategory object
```

### Update Subcategory (Operator/Admin)
```http
PATCH /v1/subcategories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Desktop Computer"
}

Response: Updated subcategory object
```

### Delete Subcategory (Admin Only)
```http
DELETE /v1/subcategories/:id
Authorization: Bearer {token}

Response:
{
  "message": "SubCategory deleted successfully"
}
```

---

## 🎯 Reservation Service (Port 3003)

### Public Endpoints

#### Get Equipment Availability
```http
GET /v1/availability

Response:
[
  {
    "id": "uuid",
    "assetTypeId": "uuid",
    "assetTypeName": "Laptop",
    "totalCount": 10,
    "assignedCount": 3,
    "reservedCount": 2,
    "availableCount": 5,
    "updatedAt": "2025-10-09T15:00:00.000Z"
  }
]
```

#### Check Specific Equipment Availability
```http
GET /v1/availability/:assetTypeId?requestDate=2025-10-15T10:00:00Z&returnDate=2025-10-20T17:00:00Z

Response:
{
  "assetTypeId": "uuid",
  "requestDate": "2025-10-15T10:00:00Z",
  "returnDate": "2025-10-20T17:00:00Z",
  "availableCount": 5
}
```

#### Create Reservation Request (Public)
```http
POST /v1/reservations
Content-Type: application/json

{
  "requesterEmail": "user@example.com",        // Optional (for unauthenticated)
  "requesterName": "John Doe",                 // Optional (for unauthenticated)
  "requestDate": "2025-10-15T10:00:00Z",       // When to pick up
  "returnDate": "2025-10-20T17:00:00Z",        // Expected return
  "items": [
    {
      "assetTypeId": "uuid",                   // Equipment type UUID
      "assetTypeName": "Laptop",               // Equipment type name
      "quantity": 1,                           // Optional, default 1
      "notes": "Need for conference"           // Optional
    }
  ],
  "notes": "Urgent request for presentation"  // Optional
}

Response:
{
  "id": "uuid",
  "requesterId": "user-id-or-anonymous",
  "requesterEmail": "user@example.com",
  "requesterName": "John Doe",
  "status": "pending",
  "requestDate": "2025-10-15T10:00:00.000Z",
  "approvedDate": null,
  "returnDate": "2025-10-20T17:00:00.000Z",
  "actualReturnDate": null,
  "approvedBy": null,
  "deniedBy": null,
  "denialReason": null,
  "notes": "Urgent request for presentation",
  "createdAt": "2025-10-09T15:00:00.000Z",
  "updatedAt": "2025-10-09T15:00:00.000Z",
  "items": [
    {
      "id": "uuid",
      "reservationId": "uuid",
      "assetTypeId": "uuid",
      "assetTypeName": "Laptop",
      "assetId": null,
      "quantity": 1,
      "status": "pending",
      "notes": "Need for conference"
    }
  ]
}
```

#### List Reservations
```http
GET /v1/reservations?status=pending&limit=50&cursor=base64cursor

Query Parameters:
- status: pending | approved | denied | active | returned | cancelled
- requesterId: UUID (operator/admin can filter by any user)
- limit: 1-100 (default 50)
- cursor: Base64 encoded pagination cursor

Note: Regular users can only see their own reservations
      Operators/Admins can see all reservations

Response:
{
  "items": [...array of reservations...],
  "nextCursor": "base64cursor" | null
}
```

#### Get Single Reservation
```http
GET /v1/reservations/:id

Note: Users can only see their own unless operator/admin

Response: Reservation object with items
```

#### Cancel Reservation
```http
POST /v1/reservations/:id/cancel

Note: Users can cancel their own pending reservations
      Operators/Admins can cancel any pending reservation

Response: Updated reservation object
```

---

### Operator/Admin Endpoints

#### Approve Reservation
```http
POST /v1/reservations/:id/approve
Authorization: Bearer {token}
Content-Type: application/json

{
  "assetIds": ["uuid1", "uuid2"],  // Asset IDs to assign (must match item count)
  "notes": "Approved for pickup"   // Optional
}

Response: Updated reservation with status "approved" and assigned assets
```

#### Deny Reservation
```http
POST /v1/reservations/:id/deny
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Not available for requested dates"
}

Response: Updated reservation with status "denied"
```

#### Activate Reservation (Mark as Picked Up)
```http
POST /v1/reservations/:id/activate
Authorization: Bearer {token}

Note: Changes status from "approved" to "active"

Response: Updated reservation object
```

#### Return Equipment
```http
POST /v1/reservations/:id/return
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Equipment returned in good condition"  // Optional
}

Response: Updated reservation with status "returned"
```

---

## 🔄 Reservation Workflow

1. **User Creates Reservation** (Public/Authenticated)
   - Status: `pending`
   - Equipment not yet assigned

2. **Operator Reviews & Approves** (Operator/Admin)
   - Assigns specific assets to items
   - Status: `approved`

3. **User Picks Up Equipment** (Operator marks as active)
   - Status: `active`
   - Equipment in use

4. **User Returns Equipment** (Operator marks as returned)
   - Status: `returned`
   - Assets available again

**Alternative Flows:**
- **Denial**: Operator denies request → Status: `denied`
- **Cancellation**: User/Operator cancels pending → Status: `cancelled`

---

## 📊 Reservation Statuses

| Status | Description | Who Can Set |
|--------|-------------|-------------|
| `pending` | Initial state | System (on creation) |
| `approved` | Approved, assets assigned | Operator/Admin |
| `denied` | Request denied | Operator/Admin |
| `active` | Equipment picked up | Operator/Admin |
| `returned` | Equipment returned | Operator/Admin |
| `cancelled` | Reservation cancelled | User (own pending) / Operator/Admin |

---

## 🔍 Usage Examples

### Complete Reservation Flow

```bash
# 1. Check availability
curl http://localhost:3003/v1/availability

# 2. Create reservation
curl -X POST http://localhost:3003/v1/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "requesterEmail": "user@example.com",
    "requesterName": "John Doe",
    "requestDate": "2025-10-15T10:00:00Z",
    "returnDate": "2025-10-20T17:00:00Z",
    "items": [{
      "assetTypeId": "550e8400-e29b-41d4-a716-446655440001",
      "assetTypeName": "Laptop",
      "quantity": 1
    }]
  }'

# 3. Operator approves (requires auth)
curl -X POST http://localhost:3003/v1/reservations/{id}/approve \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "assetIds": ["asset-uuid"],
    "notes": "Approved for pickup on Oct 15"
  }'

# 4. Mark as picked up
curl -X POST http://localhost:3003/v1/reservations/{id}/activate \
  -H "Authorization: Bearer {token}"

# 5. Return equipment
curl -X POST http://localhost:3003/v1/reservations/{id}/return \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Returned in good condition"}'
```

---

## 🎯 Integration Notes

### For Frontend Developers

1. **Equipment Catalog**: Fetch from `/v1/availability` to show available equipment types
2. **Reservation Form**: Use asset type IDs from availability endpoint
3. **User Flow**: 
   - General users: Can create and view their own reservations
   - Operators: Can view all, approve/deny, activate, return
   - Admins: Full control including deletions

### Data Synchronization

The Reservation Service maintains a snapshot of equipment availability:
- `EquipmentAvailability` table stores current counts
- Should sync with Asset Service for real-time updates
- Currently uses seed data for testing

### Future Enhancements

- Real-time sync with Asset Service
- Email notifications on status changes
- Calendar integration for availability
- Conflict detection and automatic suggestions
- Equipment maintenance scheduling

