# Complete Frontend Specification for IT Helpdesk System
## For v0.dev / Cursor AI / AI Code Generators

---

## 🎯 Project Overview

**System**: IT Helpdesk Ticketing & Asset Management Platform  
**Architecture**: React/Next.js frontend + 4 NestJS microservices backend  
**User Types**: General (public), Operator (authenticated), Admin (authenticated)  
**Tech Stack**: React, TypeScript, Tailwind CSS, Next.js App Router, Axios, React Query

---

## 📡 Backend API Services

### Service Endpoints
```
Identity Service:  http://localhost:3000/v1
Ticket Service:    http://localhost:3001/v1
Asset Service:     http://localhost:3002/v1
Reservation Service: http://localhost:3003/v1
```

### Authentication
- JWT tokens stored in `localStorage`
- Token included in `Authorization: Bearer {token}` header
- Three roles: `general`, `operator`, `admin`
- Public routes: No authentication required
- Protected routes: Require authentication and specific roles

---

## 🗂️ Complete Application Structure

### Pages & Routes

```
/                                 → Home/Landing Page (Public)
/login                            → Login Page (Public)
/register                         → Registration Page (Public)
/tickets                          → Ticket List (Public - view only)
/tickets/new                      → Create Ticket (Public)
/tickets/:id                      → Ticket Detail & Comments (Public)
/reservations                     → Reservation List (Public/Auth)
/reservations/new                 → Request Reservation (Public)
/reservations/:id                 → Reservation Detail (Public/Auth)

/dashboard                        → Main Dashboard (Operator/Admin)
  ├─ /dashboard/tickets           → Ticket Management (Operator/Admin)
  ├─ /dashboard/reservations      → Reservation Management (Operator/Admin)
  ├─ /dashboard/assets            → Asset Management (Operator/Admin)
  ├─ /dashboard/categories        → Category Management (Operator/Admin)
  ├─ /dashboard/analytics         → Analytics Dashboard (Operator/Admin)
  └─ /dashboard/profile           → User Profile (Authenticated)

/admin                            → Admin Panel (Admin only)
  ├─ /admin/users                 → User Management
  ├─ /admin/settings              → System Settings
  └─ /admin/categories            → Category Management (Full CRUD)
```

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: #3B82F6 (Blue)
--primary-hover: #2563EB
--secondary: #10B981 (Green)
--danger: #EF4444 (Red)
--warning: #F59E0B (Amber)

/* Status Colors */
--status-open: #3B82F6 (Blue)
--status-in-progress: #F59E0B (Amber)
--status-resolved: #10B981 (Green)
--status-closed: #6B7280 (Gray)

/* Priority Colors */
--priority-low: #10B981 (Green)
--priority-medium: #F59E0B (Amber)
--priority-high: #F97316 (Orange)
--priority-urgent: #EF4444 (Red)

/* Reservation Status */
--reservation-pending: #F59E0B
--reservation-approved: #10B981
--reservation-denied: #EF4444
--reservation-active: #3B82F6
--reservation-returned: #6B7280
```

### Typography
- Headings: Inter or System Font
- Body: Inter or System Font
- Monospace (for IDs, tags): Fira Code or Mono

### Spacing
- Use Tailwind's spacing scale (4px base)
- Card padding: `p-6`
- Section spacing: `space-y-6`

---

## 📦 Core Components Library

### 1. Layout Components

#### `<AppLayout>`
Main application layout with sidebar (for authenticated users).

```tsx
interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

Features:
- Responsive sidebar (collapsible on mobile)
- Top navigation bar with user menu
- Breadcrumbs
- Role-based navigation items
```

#### `<Sidebar>`
Navigation sidebar for dashboard.

```tsx
Navigation Items by Role:
General:
  - Dashboard
  - My Tickets
  - My Reservations
  - Profile

Operator:
  - Dashboard
  - All Tickets
  - All Reservations
  - Assets
  - Categories
  - Profile

Admin:
  - Dashboard
  - All Tickets
  - All Reservations
  - Assets
  - Categories
  - Analytics
  - User Management
  - Settings
  - Profile
```

#### `<Navbar>`
Top navigation bar.

```tsx
Features:
- Logo/Brand
- Search bar (tickets, assets)
- Notifications dropdown
- User menu (Profile, Logout)
- Login/Register buttons (when not authenticated)
```

### 2. Data Display Components

#### `<TicketCard>`
Display ticket information in card format.

```tsx
interface TicketCardProps {
  ticket: {
    id: string;
    number: string;
    title: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category?: { name: string };
    createdAt: string;
    updatedAt: string;
  };
  onClick?: () => void;
}

Features:
- Status badge (colored)
- Priority indicator
- Ticket number
- Created/Updated timestamps
- Category tag
- Click to view details
```

#### `<ReservationCard>`
Display reservation information.

```tsx
interface ReservationCardProps {
  reservation: {
    id: string;
    status: string;
    requestDate: string;
    returnDate: string;
    requesterName?: string;
    requesterEmail?: string;
    items: Array<{
      assetTypeName: string;
      quantity: number;
    }>;
  };
  onClick?: () => void;
}

Features:
- Status badge
- Equipment list
- Date range
- Requester info
- Action buttons (based on status and role)
```

#### `<AssetCard>`
Display asset information.

```tsx
interface AssetCardProps {
  asset: {
    id: string;
    assetTag: string;
    assetType: { name: string };
    status: 'available' | 'assigned' | 'maintenance' | 'retired';
    location?: string;
    summary?: string;
  };
  onAssign?: () => void;
  onUnassign?: () => void;
}

Features:
- Asset tag (prominent)
- Type and status badges
- Location
- Quick actions (assign/unassign) for operators/admins
```

#### `<StatusBadge>`
Reusable status indicator.

```tsx
interface StatusBadgeProps {
  status: string;
  type: 'ticket' | 'reservation' | 'asset';
}

Features:
- Dynamic color based on status and type
- Rounded corners
- Small, medium, large sizes
```

#### `<PriorityBadge>`
Priority indicator for tickets.

```tsx
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}
```

### 3. Form Components

#### `<Input>`
Text input field.

```tsx
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}
```

#### `<TextArea>`
Multi-line text input.

```tsx
interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  error?: string;
}
```

#### `<Select>`
Dropdown select.

```tsx
interface SelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}
```

#### `<DatePicker>`
Date/time selection.

```tsx
interface DatePickerProps {
  label: string;
  value: string | Date;
  onChange: (value: string) => void;
  minDate?: Date;
  error?: string;
}
```

#### `<Button>`
Action button.

```tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit';
}
```

### 4. Feedback Components

#### `<Alert>`
Alert/notification messages.

```tsx
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

#### `<Modal>`
Modal dialog.

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

#### `<Loading>`
Loading spinner.

```tsx
interface LoadingProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

#### `<EmptyState>`
Empty state display.

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}
```

### 5. Analytics Components

#### `<StatCard>`
Display a single statistic.

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; trend: 'up' | 'down' };
  icon?: React.ReactNode;
  color?: string;
}
```

#### `<ChartCard>`
Wrapper for charts.

```tsx
interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode; // Chart component
}
```

#### `<ProgressBar>`
Progress indicator.

```tsx
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  color?: string;
}
```

---

## 📄 Detailed Page Specifications

### 1. Home Page (`/`)

**Purpose**: Landing page for general users, quick access to common actions.

**Layout**:
- Hero section with system description
- Quick actions: "Submit Ticket", "Request Equipment"
- Recent tickets (public view)
- Login/Register buttons in navbar

**Components**:
```tsx
<PublicLayout>
  <Hero
    title="IT Helpdesk & Asset Management"
    subtitle="Get help quickly or reserve equipment"
    actions={[
      { label: 'Submit a Ticket', href: '/tickets/new', primary: true },
      { label: 'Request Equipment', href: '/reservations/new' },
    ]}
  />
  
  <Section title="Recent Tickets">
    <TicketList 
      endpoint="/v1/tickets?limit=6"
      columns={3}
    />
  </Section>
  
  <Section title="Available Equipment">
    <EquipmentList 
      endpoint="/v1/availability"
    />
  </Section>
</PublicLayout>
```

### 2. Login Page (`/login`)

**Purpose**: User authentication.

**API**: `POST /v1/auth/login`

**Fields**:
- Email (required, validated)
- Password (required, min 8 chars)
- "Remember me" checkbox
- "Forgot password" link

**Form Submission**:
```tsx
const login = async (email: string, password: string) => {
  const response = await api.post('/v1/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  router.push('/dashboard');
};
```

**Validation**:
- Email: Valid email format
- Password: Not empty
- Show error message on failed login

### 3. Register Page (`/register`)

**Purpose**: New user registration.

**API**: `POST /v1/auth/register`

**Fields**:
- Email (required, validated)
- Password (required, min 8 chars, strength indicator)
- Confirm Password (must match)
- Name (optional)
- Role selection (default: general)

**Form Submission**:
```tsx
const register = async (data: RegisterData) => {
  const response = await api.post('/v1/auth/register', data);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  router.push('/dashboard');
};
```

### 4. Ticket List Page (`/tickets`)

**Purpose**: Browse all tickets (public view).

**API**: `GET /v1/tickets?limit=50&cursor={cursor}`

**Features**:
- Filter by status, priority, category
- Search by ticket number or title
- Pagination (infinite scroll or cursor-based)
- Sort by created date, updated date
- Click to view details

**Layout**:
```tsx
<PageLayout title="All Tickets">
  <FilterBar>
    <Select label="Status" options={ticketStatuses} />
    <Select label="Priority" options={priorities} />
    <Select label="Category" options={categories} />
    <SearchInput placeholder="Search tickets..." />
  </FilterBar>
  
  <TicketGrid>
    {tickets.map(ticket => (
      <TicketCard key={ticket.id} ticket={ticket} />
    ))}
  </TicketGrid>
  
  <Pagination />
</PageLayout>
```

### 5. Create Ticket Page (`/tickets/new`)

**Purpose**: Submit new support ticket (public).

**API**: `POST /v1/tickets`

**Fields**:
- Title (required, max 200 chars)
- Description (optional, max 2000 chars)
- Type: incident | request (default: incident)
- Priority: low | medium | high | urgent (default: medium)
- Category (select from API)
- Subcategory (dependent on category)
- Requester By (email or name, for unauthenticated users)

**Category Cascade**:
```tsx
const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);

// Load categories on mount
useEffect(() => {
  fetch('/v1/categories').then(res => res.json()).then(setCategories);
}, []);

// Load subcategories when category changes
useEffect(() => {
  if (selectedCategory) {
    fetch(`/v1/categories/${selectedCategory}/subcategories`)
      .then(res => res.json())
      .then(setSubcategories);
  }
}, [selectedCategory]);
```

**Form Submission**:
```tsx
const createTicket = async (data: CreateTicketData) => {
  const response = await api.post('/v1/tickets', data);
  toast.success(`Ticket ${response.data.number} created!`);
  router.push(`/tickets/${response.data.id}`);
};
```

### 6. Ticket Detail Page (`/tickets/:id`)

**Purpose**: View ticket details and add comments.

**APIs**:
- `GET /v1/tickets/:id`
- `GET /v1/tickets/:id/comments`
- `POST /v1/tickets/:id/comments`

**Layout**:
```tsx
<PageLayout>
  <TicketHeader>
    <h1>{ticket.number}: {ticket.title}</h1>
    <StatusBadge status={ticket.status} />
    <PriorityBadge priority={ticket.priority} />
  </TicketHeader>
  
  <TicketDetails>
    <InfoRow label="Type">{ticket.type}</InfoRow>
    <InfoRow label="Category">{ticket.category?.name}</InfoRow>
    <InfoRow label="Subcategory">{ticket.subcategory?.name}</InfoRow>
    <InfoRow label="Created">{formatDate(ticket.createdAt)}</InfoRow>
    <InfoRow label="Last Updated">{formatDate(ticket.updatedAt)}</InfoRow>
    <InfoRow label="Description">{ticket.description}</InfoRow>
  </TicketDetails>
  
  <CommentSection>
    <h3>Comments ({comments.length})</h3>
    {comments.map(comment => (
      <CommentItem key={comment.id} comment={comment} />
    ))}
    
    <AddCommentForm
      onSubmit={(body, authorName) => {
        api.post(`/v1/tickets/${id}/comments`, { body, authorName });
      }}
    />
  </CommentSection>
</PageLayout>
```

**Operator/Admin Actions** (if authenticated):
- Update status button
- Assign to user button
- Edit ticket button

### 7. Reservation List Page (`/reservations`)

**Purpose**: Browse reservations (public shows own, operator/admin shows all).

**API**: `GET /v1/reservations?status={status}&limit=50`

**Features**:
- Filter by status
- Search by requester
- Role-based filtering (users see only theirs)
- Click to view details

### 8. Create Reservation Page (`/reservations/new`)

**Purpose**: Request equipment reservation (public).

**API**: `POST /v1/reservations`

**Steps**:
1. Select equipment types (from `/v1/availability`)
2. Choose quantity for each type
3. Select dates (request date, return date)
4. Add notes
5. Provide contact info (if unauthenticated)

**Form**:
```tsx
<ReservationForm>
  <Step1_SelectEquipment>
    <EquipmentAvailabilityList>
      {availableEquipment.map(eq => (
        <EquipmentSelector
          equipment={eq}
          onSelect={(quantity) => addToCart(eq, quantity)}
        />
      ))}
    </EquipmentAvailabilityList>
  </Step1_SelectEquipment>
  
  <Step2_SelectDates>
    <DatePicker label="Pickup Date" value={requestDate} />
    <DatePicker label="Return Date" value={returnDate} minDate={requestDate} />
    <AvailabilityCheck
      items={selectedEquipment}
      dates={{ requestDate, returnDate }}
    />
  </Step2_SelectDates>
  
  <Step3_ContactInfo>
    <Input label="Your Name" />
    <Input label="Your Email" type="email" />
    <TextArea label="Notes" />
  </Step3_ContactInfo>
  
  <Button type="submit">Submit Reservation Request</Button>
</ReservationForm>
```

### 9. Reservation Detail Page (`/reservations/:id`)

**Purpose**: View reservation details and manage lifecycle.

**APIs**:
- `GET /v1/reservations/:id`
- `POST /v1/reservations/:id/approve` (Operator/Admin)
- `POST /v1/reservations/:id/deny` (Operator/Admin)
- `POST /v1/reservations/:id/activate` (Operator/Admin)
- `POST /v1/reservations/:id/return` (Operator/Admin)
- `POST /v1/reservations/:id/cancel` (User/Operator/Admin)

**Layout**:
```tsx
<PageLayout>
  <ReservationHeader>
    <h1>Reservation #{reservation.id.slice(0, 8)}</h1>
    <StatusBadge status={reservation.status} type="reservation" />
  </ReservationHeader>
  
  <ReservationDetails>
    <InfoRow label="Requester">{reservation.requesterName}</InfoRow>
    <InfoRow label="Email">{reservation.requesterEmail}</InfoRow>
    <InfoRow label="Pickup Date">{formatDate(reservation.requestDate)}</InfoRow>
    <InfoRow label="Return Date">{formatDate(reservation.returnDate)}</InfoRow>
    {reservation.actualReturnDate && (
      <InfoRow label="Actual Return">{formatDate(reservation.actualReturnDate)}</InfoRow>
    )}
  </ReservationDetails>
  
  <EquipmentList>
    <h3>Requested Equipment</h3>
    {reservation.items.map(item => (
      <EquipmentItem key={item.id} item={item} />
    ))}
  </EquipmentList>
  
  <ActionButtons>
    {/* Show buttons based on status and user role */}
    {canApprove && <Button onClick={handleApprove}>Approve</Button>}
    {canDeny && <Button variant="danger" onClick={handleDeny}>Deny</Button>}
    {canActivate && <Button onClick={handleActivate}>Mark as Picked Up</Button>}
    {canReturn && <Button onClick={handleReturn}>Mark as Returned</Button>}
    {canCancel && <Button variant="secondary" onClick={handleCancel}>Cancel</Button>}
  </ActionButtons>
</PageLayout>
```

### 10. Dashboard Page (`/dashboard`)

**Purpose**: Main dashboard for authenticated users (Operator/Admin).

**APIs**:
- `GET /v1/analytics/tickets?days=30`
- `GET /v1/analytics/reservations?days=30`
- `GET /v1/analytics/assets`

**Layout** (Admin View):
```tsx
<DashboardLayout>
  <StatsGrid>
    <StatCard
      title="Open Tickets"
      value={analytics.tickets.summary.open}
      change={{ value: 12, trend: 'up' }}
      icon={<TicketIcon />}
    />
    <StatCard
      title="Pending Reservations"
      value={analytics.reservations.summary.byStatus.pending}
      icon={<CalendarIcon />}
    />
    <StatCard
      title="Asset Utilization"
      value={`${analytics.assets.summary.utilizationRate}%`}
      icon={<BoxIcon />}
    />
    <StatCard
      title="On-Time Return Rate"
      value={`${analytics.reservations.performance.onTimeReturnRate}%`}
      icon={<CheckIcon />}
    />
  </StatsGrid>
  
  <ChartsGrid>
    <ChartCard title="Ticket Health">
      <TicketHealthChart data={analytics.tickets} />
    </ChartCard>
    
    <ChartCard title="Reservation Trend">
      <ReservationTrendChart data={analytics.reservations.trend} />
    </ChartCard>
  </ChartsGrid>
  
  <TablesGrid>
    <TableCard title="Recent Tickets">
      <TicketTable
        endpoint="/v1/analytics/tickets/recent-activity?limit=10"
        columns={['number', 'title', 'status', 'priority', 'updatedAt']}
      />
    </TableCard>
    
    <TableCard title="Upcoming Returns">
      <ReservationTable
        data={analytics.reservations.upcoming.reservations}
        columns={['requester', 'equipment', 'dueDate']}
      />
    </TableCard>
  </TablesGrid>
</DashboardLayout>
```

### 11. Ticket Management Page (`/dashboard/tickets`)

**Purpose**: Manage all tickets (Operator/Admin).

**APIs**:
- `GET /v1/tickets`
- `PATCH /v1/tickets/:id/status`

**Features**:
- Advanced filtering
- Bulk actions
- Assign to operator
- Update status
- Quick view modal

### 12. Asset Management Page (`/dashboard/assets`)

**Purpose**: Manage asset inventory (Operator/Admin).

**APIs**:
- `GET /v1/assets`
- `POST /v1/assets`
- `POST /v1/assets/:id/assign`
- `POST /v1/assets/:id/unassign`

**Features**:
- Asset CRUD
- Assign/unassign modal
- Filter by type, status, location
- Asset lifecycle timeline

### 13. Analytics Page (`/dashboard/analytics`)

**Purpose**: Comprehensive analytics dashboard (Admin only).

**APIs**:
- `GET /v1/analytics/tickets?days={days}`
- `GET /v1/analytics/reservations?days={days}`
- `GET /v1/analytics/assets`
- `GET /v1/analytics/assets/aging`
- `GET /v1/analytics/assets/assignment-trends`
- `GET /v1/analytics/equipment-utilization`

**Sections**:

#### A. Ticket Analytics
```tsx
<AnalyticsSection title="Ticket Health">
  <MetricsRow>
    <Metric label="Total Tickets" value={data.total} />
    <Metric label="Open Rate" value={`${data.openRate}%`} />
    <Metric label="MTTR" value={`${data.mttrDays} days`} />
    <Metric label="SLA Breach Rate" value={`${data.slaBreachRate}%`} />
  </MetricsRow>
  
  <ChartRow>
    <LineChart
      title="Backlog Trend"
      data={data.trends.backlog}
      xKey="date"
      yKeys={['created', 'resolved']}
    />
    
    <PieChart
      title="Priority Distribution"
      data={data.trends.byPriority}
    />
  </ChartRow>
  
  <Table
    title="Volume by Category"
    data={data.categories}
    columns={['category', 'total', 'open', 'closed']}
  />
</AnalyticsSection>
```

#### B. Reservation Analytics
```tsx
<AnalyticsSection title="Reservation Performance">
  <MetricsRow>
    <Metric label="Total Reservations" value={data.total} />
    <Metric label="On-Time Return Rate" value={`${data.onTimeReturnRate}%`} />
    <Metric label="Avg Usage Duration" value={`${data.avgUsageDays} days`} />
    <Metric label="Approval Rate" value={`${data.approvalRate}%`} />
  </MetricsRow>
  
  <ChartRow>
    <LineChart
      title="Reservation Trend"
      data={data.trend}
      xKey="date"
      yKeys={['created', 'approved', 'returned']}
    />
    
    <BarChart
      title="Most Requested Equipment"
      data={data.equipment.mostRequested}
      xKey="equipmentType"
      yKey="count"
    />
  </ChartRow>
  
  <Table
    title="Upcoming Due (7 Days)"
    data={data.upcoming.reservations}
    columns={['requester', 'equipment', 'returnDate', 'status']}
  />
</AnalyticsSection>
```

#### C. Asset Analytics
```tsx
<AnalyticsSection title="Asset Overview">
  <MetricsRow>
    <Metric label="Total Assets" value={data.total} />
    <Metric label="Utilization Rate" value={`${data.utilizationRate}%`} />
    <Metric label="Available" value={data.byStatus.available} />
    <Metric label="Needs Refresh" value={data.aging.needsRefresh.count} />
  </MetricsRow>
  
  <ChartRow>
    <DonutChart
      title="Status Distribution"
      data={data.byStatus}
    />
    
    <BarChart
      title="Assets by Type"
      data={data.byType}
      xKey="type"
      yKey="total"
    />
  </ChartRow>
  
  <Table
    title="Asset Aging (3+ Years)"
    data={data.aging.needsRefresh.assets}
    columns={['assetTag', 'type', 'ageYears', 'status']}
  />
</AnalyticsSection>
```

---

## 🔐 Authentication & Authorization

### Auth Context/Provider

```tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isOperator: boolean;
  isAdmin: boolean;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/v1/auth/login', { email, password });
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isOperator: user?.role === 'operator' || user?.role === 'admin',
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Protected Routes

```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (roles && !roles.includes(user?.role || '')) {
    router.push('/dashboard');
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
};
```

---

## 🌐 API Integration

### Axios Instance

```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost',
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Service-Specific API Modules

```tsx
// services/identityApi.ts
export const identityApi = {
  login: (email: string, password: string) =>
    api.post('http://localhost:3000/v1/auth/login', { email, password }),
  
  register: (data: RegisterData) =>
    api.post('http://localhost:3000/v1/auth/register', data),
  
  getProfile: () =>
    api.get('http://localhost:3000/v1/auth/me'),
};

// services/ticketApi.ts
export const ticketApi = {
  list: (params?: { status?: string; limit?: number; cursor?: string }) =>
    api.get('http://localhost:3001/v1/tickets', { params }),
  
  get: (id: string) =>
    api.get(`http://localhost:3001/v1/tickets/${id}`),
  
  create: (data: CreateTicketData) =>
    api.post('http://localhost:3001/v1/tickets', data),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`http://localhost:3001/v1/tickets/${id}/status`, { status }),
  
  getComments: (id: string) =>
    api.get(`http://localhost:3001/v1/tickets/${id}/comments`),
  
  addComment: (id: string, data: { body: string; authorName?: string }) =>
    api.post(`http://localhost:3001/v1/tickets/${id}/comments`, data),
  
  getCategories: () =>
    api.get('http://localhost:3001/v1/categories'),
  
  getAnalytics: (days: number = 30) =>
    api.get(`http://localhost:3001/v1/analytics/tickets?days=${days}`),
};

// services/assetApi.ts
export const assetApi = {
  list: (params?: any) =>
    api.get('http://localhost:3002/v1/assets', { params }),
  
  create: (data: CreateAssetData) =>
    api.post('http://localhost:3002/v1/assets', data),
  
  assign: (id: string, personId: string) =>
    api.post(`http://localhost:3002/v1/assets/${id}/assign`, { personId }),
  
  unassign: (id: string) =>
    api.post(`http://localhost:3002/v1/assets/${id}/unassign`),
  
  getAnalytics: () =>
    api.get('http://localhost:3002/v1/analytics/assets'),
  
  getAging: () =>
    api.get('http://localhost:3002/v1/analytics/assets/aging'),
};

// services/reservationApi.ts
export const reservationApi = {
  list: (params?: { status?: string }) =>
    api.get('http://localhost:3003/v1/reservations', { params }),
  
  get: (id: string) =>
    api.get(`http://localhost:3003/v1/reservations/${id}`),
  
  create: (data: CreateReservationData) =>
    api.post('http://localhost:3003/v1/reservations', data),
  
  approve: (id: string, data: { assetIds: string[]; notes?: string }) =>
    api.post(`http://localhost:3003/v1/reservations/${id}/approve`, data),
  
  deny: (id: string, reason: string) =>
    api.post(`http://localhost:3003/v1/reservations/${id}/deny`, { reason }),
  
  activate: (id: string) =>
    api.post(`http://localhost:3003/v1/reservations/${id}/activate`),
  
  return: (id: string, notes?: string) =>
    api.post(`http://localhost:3003/v1/reservations/${id}/return`, { notes }),
  
  cancel: (id: string) =>
    api.post(`http://localhost:3003/v1/reservations/${id}/cancel`),
  
  getAvailability: () =>
    api.get('http://localhost:3003/v1/availability'),
  
  getAnalytics: (days: number = 30) =>
    api.get(`http://localhost:3003/v1/analytics/reservations?days=${days}`),
};
```

### React Query Hooks

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Tickets
export const useTickets = (params?: any) => {
  return useQuery(['tickets', params], () => ticketApi.list(params));
};

export const useTicket = (id: string) => {
  return useQuery(['ticket', id], () => ticketApi.get(id));
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation(ticketApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
    },
  });
};

// Reservations
export const useReservations = (params?: any) => {
  return useQuery(['reservations', params], () => reservationApi.list(params));
};

export const useReservation = (id: string) => {
  return useQuery(['reservation', id], () => reservationApi.get(id));
};

// Analytics
export const useTicketAnalytics = (days: number = 30) => {
  return useQuery(['analytics', 'tickets', days], () => ticketApi.getAnalytics(days));
};

export const useAssetAnalytics = () => {
  return useQuery(['analytics', 'assets'], () => assetApi.getAnalytics());
};

export const useReservationAnalytics = (days: number = 30) => {
  return useQuery(['analytics', 'reservations', days], () => reservationApi.getAnalytics(days));
};
```

---

## 🎨 UI/UX Guidelines

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile
- Stacked cards on mobile, grid on desktop

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus states clearly visible
- Color contrast ratio WCAG AA compliant
- Screen reader friendly

### Loading States
- Skeleton loaders for cards
- Spinner for button actions
- Progress bar for multi-step forms

### Error Handling
- Toast notifications for actions
- Inline form validation errors
- Friendly error messages
- Retry buttons for failed requests

### Empty States
- Illustrative icons
- Clear call-to-action
- Helpful guidance text

---

## 📱 Additional Features

### Search
- Global search bar in navbar
- Search tickets by number, title
- Search assets by tag, type
- Debounced search input

### Notifications
- Dropdown in navbar
- Real-time updates (future: WebSocket)
- Mark as read functionality
- Filter by type

### Profile Page
- View/edit user info
- Change password
- Notification preferences
- Activity history

### Dark Mode (Optional)
- Toggle in user menu
- Stored in localStorage
- Tailwind dark: classes

---

## 🧪 Testing Considerations

### Unit Tests
- Component rendering
- Form validation
- Utility functions

### Integration Tests
- API calls (mocked)
- User flows
- Protected routes

### E2E Tests (Cypress/Playwright)
- Complete user journeys
- Ticket creation → comment → close
- Reservation request → approval → return

---

## 📦 Project Setup

### Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "recharts": "^2.10.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.4.1"
  }
}
```

### Environment Variables
```env
NEXT_PUBLIC_IDENTITY_API=http://localhost:3000/v1
NEXT_PUBLIC_TICKET_API=http://localhost:3001/v1
NEXT_PUBLIC_ASSET_API=http://localhost:3002/v1
NEXT_PUBLIC_RESERVATION_API=http://localhost:3003/v1
```

---

## 🚀 Build Instructions for AI

### For v0.dev:
1. Create Next.js App Router project with TypeScript
2. Set up Tailwind CSS
3. Implement all pages in sequence (Home → Login → Dashboard)
4. Build component library first
5. Integrate API calls with React Query
6. Add authentication context
7. Implement role-based routing
8. Style with Tailwind (use provided color scheme)
9. Add charts using Recharts
10. Test all user flows

### For Cursor AI:
1. Generate file structure based on pages
2. Create reusable components in `/components`
3. Set up API services in `/services`
4. Implement hooks in `/hooks`
5. Add types in `/types`
6. Configure routing with middleware for auth
7. Build pages progressively
8. Ensure responsive design
9. Add loading and error states
10. Test integration with backend

---

## ✅ Completion Checklist

- [ ] All pages implemented
- [ ] Authentication working
- [ ] Role-based access control
- [ ] All API endpoints integrated
- [ ] Charts displaying analytics
- [ ] Forms validated
- [ ] Responsive on all screen sizes
- [ ] Loading states for all async actions
- [ ] Error handling throughout
- [ ] Toast notifications
- [ ] Search functionality
- [ ] Pagination working
- [ ] Modal dialogs functional
- [ ] Comments system
- [ ] Category cascade in forms
- [ ] Reservation workflow complete
- [ ] Asset assignment working
- [ ] Dashboard analytics displaying
- [ ] Profile page functional

---

## 🎯 Success Criteria

**Must Have:**
1. ✅ Public ticket submission works
2. ✅ Public reservation request works
3. ✅ Login/Register functional
4. ✅ Operators can manage tickets and reservations
5. ✅ Admins see full analytics dashboard
6. ✅ Role-based navigation
7. ✅ All CRUD operations work
8. ✅ Responsive design
9. ✅ Error handling

**Nice to Have:**
- Dark mode
- Real-time notifications
- Advanced search filters
- Export to CSV
- Keyboard shortcuts

---

**This specification covers a complete, production-ready frontend for the IT Helpdesk system. All backend APIs are functional and documented. Use this as a comprehensive guide to build the entire frontend in one build.**

