# IT Helpdesk & Asset Management System

A comprehensive IT support ticketing and equipment reservation system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Public Features
- **Ticket Submission**: Submit support tickets without authentication
- **Equipment Reservations**: Request equipment reservations
- **Ticket Tracking**: View all tickets and their status
- **Reservation Tracking**: View reservation status

### Authenticated Features
- **Dashboard**: Overview of system metrics and analytics
- **Ticket Management**: Full CRUD operations for tickets (Operator/Admin)
- **Reservation Management**: Approve, deny, activate, and return reservations (Operator/Admin)
- **Asset Management**: Manage IT assets and equipment inventory (Operator/Admin)
- **Analytics**: Comprehensive analytics dashboard with charts (Admin)
- **User Profile**: View and manage account information

### User Roles
- **General**: Can submit tickets and reservations, view own items
- **Operator**: Can manage tickets, reservations, and assets
- **Admin**: Full system access including analytics and user management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Authentication**: JWT tokens with localStorage

## Backend Services

The application connects to 4 microservices hosted on Railway:

- **Identity Service**: Authentication and user management
- **Ticket Service**: Ticket and category management
- **Asset Service**: Asset inventory management
- **Reservation Service**: Equipment reservation management

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend services deployed on Railway

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create `.env.local` file with your Railway URLs (see `.env.local.example`):
   \`\`\`env
   NEXT_PUBLIC_IDENTITY_API=https://saas-itsidentity-svc-production.up.railway.app
   NEXT_PUBLIC_TICKET_API=https://saas-itsticket-svc-production.up.railway.app
   NEXT_PUBLIC_ASSET_API=https://asset-svc-production.up.railway.app
   NEXT_PUBLIC_RESERVATION_API=https://saas-itsreservation-svc-production.up.railway.app
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

\`\`\`
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── tickets/             # Ticket pages
│   ├── reservations/        # Reservation pages
│   ├── dashboard/           # Protected dashboard pages
│   └── admin/               # Admin-only pages
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── navbar.tsx           # Navigation bar
│   ├── sidebar.tsx          # Dashboard sidebar
│   ├── ticket-card.tsx      # Ticket display card
│   ├── reservation-card.tsx # Reservation display card
│   └── ...                  # Other components
├── contexts/                # React contexts
│   └── auth-context.tsx     # Authentication context
├── hooks/                   # Custom React hooks
│   ├── use-tickets.ts       # Ticket data hooks
│   ├── use-reservations.ts  # Reservation data hooks
│   └── use-assets.ts        # Asset data hooks
├── lib/                     # Utility libraries
│   ├── api.ts               # API client configuration
│   ├── utils.ts             # Utility functions
│   └── query-provider.tsx   # React Query provider
└── types/                   # TypeScript type definitions
    └── index.ts             # All type definitions
\`\`\`

## Key Features Implementation

### Authentication
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected routes with automatic redirects
- Persistent sessions with localStorage

### Ticket System
- Create, view, and comment on tickets
- Filter by status, priority, and category
- Category and subcategory cascade selection
- Status updates for operators
- Public and authenticated access

### Reservation System
- Equipment availability checking
- Multi-item reservations
- Approval workflow (pending → approved → active → returned)
- Denial with reason tracking
- Date-based reservations

### Asset Management
- Asset CRUD operations
- Asset assignment to people
- Status tracking (available, assigned, maintenance, retired)
- Search and filter capabilities
- Asset type categorization

### Analytics Dashboard
- Ticket health metrics (MTTR, open rate, SLA breach rate)
- Reservation performance (approval rate, on-time returns)
- Asset utilization tracking
- Interactive charts with Recharts
- Time period selection (7, 30, 90 days)

## API Integration

All API calls are centralized in `lib/api.ts` with:
- Automatic JWT token injection
- Error handling and 401 redirects
- Service-specific API modules
- TypeScript type safety

## Design System

### Colors
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Danger: Red (#EF4444)

### Status Colors
- Ticket: Open (Blue), In Progress (Amber), Resolved (Green), Closed (Gray)
- Reservation: Pending (Amber), Approved (Green), Denied (Red), Active (Blue), Returned (Gray)
- Asset: Available (Green), Assigned (Blue), Maintenance (Amber), Retired (Gray)

## Contributing

This is a complete frontend implementation. To extend:

1. Add new pages in the `app/` directory
2. Create reusable components in `components/`
3. Add API hooks in `hooks/`
4. Define types in `types/index.ts`
5. Follow existing patterns for consistency

## License

MIT
