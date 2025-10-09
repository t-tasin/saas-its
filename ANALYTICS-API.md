# Analytics API Documentation

## 📊 Analytics Endpoints Overview

All analytics endpoints require **Operator** or **Admin** role authentication.

---

## 🎫 Ticket Service Analytics (Port 3001)

### Get Ticket Health Metrics
```http
GET /v1/analytics/tickets?days=30
Authorization: Bearer {token}

Query Parameters:
- days: Number of days to analyze (default: 30)

Response:
{
  "summary": {
    "total": 150,
    "open": 45,
    "closed": 105,
    "openRate": 30.0
  },
  "metrics": {
    "mttrDays": 3.5,              // Mean Time To Resolution
    "slaBreachRate": 5.2,          // % of tickets exceeding SLA
    "slaBreachCount": 8
  },
  "trends": {
    "backlog": [
      {
        "date": "2025-10-01",
        "created": 5,
        "resolved": 3,
        "delta": 2
      }
    ],
    "byPriority": {
      "low": 30,
      "medium": 80,
      "high": 35,
      "urgent": 5
    }
  },
  "categories": [
    {
      "category": "Hardware Issues",
      "total": 50,
      "open": 15,
      "closed": 35,
      "high": 10
    }
  ],
  "period": {
    "days": 30,
    "startDate": "2025-09-09T00:00:00.000Z",
    "endDate": "2025-10-09T00:00:00.000Z"
  }
}
```

### Get Status Distribution
```http
GET /v1/analytics/tickets/status-distribution
Authorization: Bearer {token}

Response:
[
  { "status": "open", "count": 45 },
  { "status": "in_progress", "count": 20 },
  { "status": "resolved", "count": 60 },
  { "status": "closed", "count": 25 }
]
```

### Get Recent Activity
```http
GET /v1/analytics/tickets/recent-activity?limit=10
Authorization: Bearer {token}

Query Parameters:
- limit: Number of records (default: 10, max: 50)

Response:
[
  {
    "id": "uuid",
    "number": "251009-0001",
    "title": "Laptop not booting",
    "status": "in_progress",
    "priority": "high",
    "updatedAt": "2025-10-09T15:00:00.000Z",
    "category": { "name": "Hardware Issues" }
  }
]
```

---

## 🗄️ Asset Service Analytics (Port 3002)

### Get Asset Overview
```http
GET /v1/analytics/assets
Authorization: Bearer {token}

Response:
{
  "summary": {
    "total": 250,
    "byStatus": {
      "available": 120,
      "assigned": 100,
      "maintenance": 20,
      "retired": 10
    },
    "utilizationRate": 48.0,
    "activeAssignments": 100
  },
  "breakdown": {
    "byType": [
      {
        "type": "Laptop",
        "total": 100,
        "available": 45,
        "assigned": 50,
        "maintenance": 3,
        "retired": 2
      }
    ],
    "byLocation": [
      {
        "location": "Building A",
        "total": 80,
        "available": 30,
        "assigned": 50
      }
    ]
  }
}
```

### Get Asset Aging Analysis
```http
GET /v1/analytics/assets/aging
Authorization: Bearer {token}

Response:
{
  "ageDistribution": {
    "under1Year": 50,
    "1to2Years": 80,
    "2to3Years": 60,
    "3to5Years": 40,
    "over5Years": 20
  },
  "needsRefresh": {
    "count": 60,
    "assets": [
      {
        "id": "uuid",
        "assetTag": "LTP-001",
        "type": "Laptop",
        "status": "assigned",
        "ageDays": 1825,
        "ageYears": 5.0,
        "createdAt": "2020-10-09T00:00:00.000Z"
      }
    ]
  },
  "averageAge": 2.5
}
```

### Get Assignment Trends
```http
GET /v1/analytics/assets/assignment-trends?days=30
Authorization: Bearer {token}

Query Parameters:
- days: Number of days to analyze (default: 30)

Response:
{
  "summary": {
    "totalAssignments": 150,
    "completed": 80,
    "active": 70,
    "avgDurationDays": 45.5
  },
  "trend": [
    {
      "date": "2025-10-01",
      "assigned": 5,
      "unassigned": 3
    }
  ],
  "mostAssigned": [
    {
      "type": "Laptop",
      "count": 50
    },
    {
      "type": "Monitor",
      "count": 30
    }
  ],
  "period": {
    "days": 30,
    "startDate": "2025-09-09T00:00:00.000Z",
    "endDate": "2025-10-09T00:00:00.000Z"
  }
}
```

### Get Lifecycle Events
```http
GET /v1/analytics/assets/lifecycle-events?limit=20
Authorization: Bearer {token}

Query Parameters:
- limit: Number of events (default: 20, max: 100)

Response:
{
  "recentEvents": [
    {
      "id": "uuid",
      "action": "assigned",
      "assetTag": "LTP-001",
      "assetType": "Laptop",
      "actorId": "user-uuid",
      "metadata": { "personId": "person-uuid" },
      "occurredAt": "2025-10-09T15:00:00.000Z"
    }
  ],
  "distribution": {
    "assigned": 50,
    "unassigned": 30,
    "maintenance": 10,
    "retired": 5
  }
}
```

---

## 📅 Reservation Service Analytics (Port 3003)

### Get Reservation Metrics
```http
GET /v1/analytics/reservations?days=30
Authorization: Bearer {token}

Query Parameters:
- days: Number of days to analyze (default: 30)

Response:
{
  "summary": {
    "total": 200,
    "byStatus": {
      "pending": 20,
      "approved": 30,
      "denied": 10,
      "active": 40,
      "returned": 95,
      "cancelled": 5
    },
    "approvalRate": 85.0
  },
  "performance": {
    "onTimeReturnRate": 87.5,
    "onTimeCount": 83,
    "lateCount": 12,
    "avgUsageDays": 5.2,
    "avgDelayDays": 2.3
  },
  "upcoming": {
    "dueWithin7Days": 15,
    "reservations": [
      {
        "id": "uuid",
        "requesterName": "John Doe",
        "requesterEmail": "john@example.com",
        "returnDate": "2025-10-12T17:00:00.000Z",
        "status": "active",
        "items": [
          {
            "assetTypeName": "Laptop",
            "quantity": 1
          }
        ]
      }
    ]
  },
  "equipment": {
    "mostRequested": [
      {
        "equipmentType": "Laptop",
        "count": 80
      },
      {
        "equipmentType": "Projector",
        "count": 45
      }
    ]
  },
  "trend": [
    {
      "date": "2025-10-01",
      "created": 8,
      "approved": 6,
      "returned": 5
    }
  ],
  "period": {
    "days": 30,
    "startDate": "2025-09-09T00:00:00.000Z",
    "endDate": "2025-10-09T00:00:00.000Z"
  }
}
```

### Get Equipment Utilization
```http
GET /v1/analytics/equipment-utilization
Authorization: Bearer {token}

Response:
{
  "overall": {
    "totalEquipment": 200,
    "totalInUse": 120,
    "totalAvailable": 80,
    "overallUtilization": 60.0
  },
  "byEquipmentType": [
    {
      "equipmentType": "Laptop",
      "total": 100,
      "assigned": 50,
      "reserved": 20,
      "available": 30,
      "utilizationRate": 70.0
    },
    {
      "equipmentType": "Projector",
      "total": 20,
      "assigned": 5,
      "reserved": 3,
      "available": 12,
      "utilizationRate": 40.0
    }
  ]
}
```

---

## 📊 Dashboard Metrics Summary

### Key Metrics for Admin Dashboard

```javascript
// Fetch all dashboard metrics
const dashboardData = await Promise.all([
  fetch('/v1/analytics/tickets?days=30'),
  fetch('/v1/analytics/reservations?days=30'),
  fetch('/v1/analytics/assets'),
  fetch('/v1/analytics/assets/aging'),
  fetch('/v1/analytics/equipment-utilization'),
]);

const [tickets, reservations, assets, aging, utilization] = dashboardData;

// Display:
// 1. Ticket Health
//    - Open vs Closed: tickets.summary.open / tickets.summary.closed
//    - MTTR: tickets.metrics.mttrDays
//    - SLA Breach Rate: tickets.metrics.slaBreachRate
//    - Backlog Trend: tickets.trends.backlog

// 2. Reservation Performance
//    - On-Time Return Rate: reservations.performance.onTimeReturnRate
//    - Total: reservations.summary.total
//    - Approval Rate: reservations.summary.approvalRate
//    - Upcoming Due: reservations.upcoming.dueWithin7Days

// 3. Asset Overview
//    - Total Assets: assets.summary.total
//    - Utilization Rate: assets.summary.utilizationRate
//    - By Status: assets.summary.byStatus
//    - By Location: assets.breakdown.byLocation
//    - Aging: aging.needsRefresh.count
//    - Needs Refresh: aging.needsRefresh.assets
```

---

## 🎨 Visualization Recommendations

### Charts for Dashboard

**Ticket Analytics:**
- Line Chart: Backlog trend (created vs resolved over time)
- Pie Chart: Priority distribution
- Bar Chart: Volume by category
- KPI Cards: Total, Open Rate, MTTR, SLA Breach Rate

**Reservation Analytics:**
- Line Chart: Reservation trend (created, approved, returned)
- Bar Chart: Most requested equipment
- Progress Bar: On-time return rate
- KPI Cards: Total, Approval Rate, Avg Usage Days

**Asset Analytics:**
- Donut Chart: Status distribution
- Bar Chart: Assets by type
- Bar Chart: Assets by location
- Age Distribution: Bar chart for age ranges
- KPI Cards: Total, Utilization Rate, Available, Needs Refresh

---

## 🔄 Real-Time Updates (Future Enhancement)

For real-time dashboard updates, consider:
1. Polling: Refresh analytics every 30-60 seconds
2. WebSocket: Push updates when data changes
3. React Query: Auto-refetch with `refetchInterval`

```tsx
// Example: Auto-refresh every 60 seconds
const { data } = useQuery(
  ['analytics', 'tickets'],
  () => ticketApi.getAnalytics(30),
  { refetchInterval: 60000 }
);
```

---

## 📈 Performance Notes

- All analytics queries are optimized for performance
- Date range filtering reduces data load
- Aggregations performed at database level
- Consider caching analytics results (Redis) for high traffic

---

**All analytics endpoints are ready for frontend integration!**

