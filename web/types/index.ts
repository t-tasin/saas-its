// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string  // Required: user's full name
  role: "general" | "operator" | "admin"
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterData {
  email: string
  password: string
  name: string  // Required: user's full name
  role?: "general" | "operator" | "admin"
}

// Ticket Types
export interface Ticket {
  id: string
  number: string
  title: string
  description?: string
  type: "incident" | "request"
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  categoryId?: string
  category?: Category
  subcategoryId?: string
  subcategory?: Subcategory
  requestedBy?: string
  assignedToId?: string
  assignedTo?: User
  createdAt: string
  updatedAt: string
}

export interface CreateTicketData {
  title: string
  description?: string
  type?: "incident" | "request"
  priority?: "low" | "medium" | "high" | "urgent"
  categoryId?: string
  subcategoryId?: string
  requestedBy?: string
}

export interface Comment {
  id: string
  ticketId: string
  body: string
  authorName?: string
  authorId?: string
  author?: User
  createdAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  categoryId: string
}

// Asset Types
export interface Asset {
  id: string
  assetTag: string
  assetTypeId: string
  assetType: AssetType
  status: "available" | "assigned" | "maintenance" | "retired"
  location?: string
  summary?: string
  assignedToId?: string
  assignedTo?: Person
  purchaseDate?: string
  createdAt: string
  updatedAt: string
}

export interface AssetType {
  id: string
  name: string
  description?: string
}

export interface Person {
  id: string
  name: string
  email?: string
}

export interface CreateAssetData {
  assetTag: string
  assetTypeId: string
  status?: "available" | "assigned" | "maintenance" | "retired"
  location?: string
  summary?: string
  purchaseDate?: string
}

// Reservation Types
export interface Reservation {
  id: string
  status: "pending" | "approved" | "denied" | "active" | "returned" | "cancelled"
  requestDate: string
  returnDate: string
  actualReturnDate?: string
  requesterName?: string
  requesterEmail?: string
  requesterId?: string
  requester?: User
  notes?: string
  denialReason?: string
  items: ReservationItem[]
  createdAt: string
  updatedAt: string
}

export interface ReservationItem {
  id: string
  reservationId: string
  assetTypeId: string
  assetTypeName: string
  quantity: number
  assignedAssets?: Asset[]
}

export interface CreateReservationData {
  requestDate: string
  returnDate: string
  requesterName?: string
  requesterEmail?: string
  notes?: string
  items: Array<{
    assetTypeId: string
    quantity: number
  }>
}

export interface EquipmentAvailability {
  assetTypeId: string
  assetTypeName: string
  totalCount: number
  availableCount: number
  assignedCount: number
  maintenanceCount: number
}

// Analytics Types
export interface TicketAnalytics {
  summary: {
    total: number
    open: number
    inProgress: number
    resolved: number
    closed: number
    openRate: number
    mttrDays: number
    slaBreachRate: number
  }
  trends: {
    backlog: Array<{ date: string; created: number; resolved: number }>
    byPriority: Array<{ priority: string; count: number }>
    byStatus: Array<{ status: string; count: number }>
  }
  categories: Array<{
    category: string
    total: number
    open: number
    closed: number
  }>
}

export interface ReservationAnalytics {
  summary: {
    total: number
    byStatus: {
      pending: number
      approved: number
      denied: number
      active: number
      returned: number
      cancelled: number
    }
  }
  performance: {
    approvalRate: number
    onTimeReturnRate: number
    avgUsageDays: number
  }
  trend: Array<{
    date: string
    created: number
    approved: number
    returned: number
  }>
  equipment: {
    mostRequested: Array<{
      equipmentType: string
      count: number
    }>
  }
  upcoming: {
    reservations: Array<{
      id: string
      requester: string
      equipment: string
      returnDate: string
      status: string
    }>
  }
}

export interface AssetAnalytics {
  summary: {
    total: number
    utilizationRate: number
    byStatus: {
      available: number
      assigned: number
      maintenance: number
      retired: number
    }
  }
  byType: Array<{
    type: string
    total: number
    available: number
    assigned: number
  }>
  aging: {
    needsRefresh: {
      count: number
      assets: Array<{
        assetTag: string
        type: string
        ageYears: number
        status: string
      }>
    }
  }
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  cursor?: string
  hasMore: boolean
}
