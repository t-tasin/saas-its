// Backend API Response Types

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedApiResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Identity Service Types
export interface LoginRequest {
  email: string
  password?: string
  role: "USER" | "OPERATOR" | "ADMIN"
}

export interface LoginResponse {
  requiresOtp: boolean
  otpSentTo?: string
  message: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  accessToken: string
  refreshToken: string
  user: BackendUser
  tenantId: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: "USER"
}

export interface RegisterResponse {
  message: string
  userId: string
}

export interface BackendUser {
  id: string
  email: string
  name: string
  role: "USER" | "OPERATOR" | "ADMIN"
  tenantId: string
  createdAt: string
  updatedAt: string
}

// Ticket Service Types
export interface BackendTicket {
  id: string
  number: string
  title: string
  description?: string
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  category?: {
    id: string
    name: string
  }
  subcategory?: {
    id: string
    name: string
  }
  requestedBy?: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateTicketRequest {
  title: string
  description?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  categoryId?: string
  subcategoryId?: string
  requestedBy?: string
  attachments?: File[]
}

export interface BackendComment {
  id: string
  ticketId: string
  body: string
  authorName?: string
  author?: {
    id: string
    name: string
  }
  createdAt: string
}

// Asset Service Types
export interface BackendAsset {
  id: string
  assetTag: string
  type: string
  status: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED"
  description?: string
  manufacturer?: string
  model?: string
  serialNumber?: string
  location?: string
  assignedTo?: {
    id: string
    name: string
    email: string
  }
  purchaseDate?: string
  cost?: number
  createdAt: string
  updatedAt: string
}

export interface CreateAssetRequest {
  assetTag: string
  type: string
  description: string
  manufacturer?: string
  model?: string
  modelGeneration?: string
  serialNumber?: string
  vendor?: string
  receivedDate?: string
  disposalDate?: string
  memory?: string
  hddSize?: string
  hddType?: string
  cpuGeneration?: string
  cpuSpeed?: string
  gpuModel?: string
  videoCard?: string
  wiredMac?: string
  wirelessMac?: string
  output1?: string
  output2?: string
  cost?: number
  po?: string
  disposalType?: string
  fundingDepartment: string
  status?: "AVAILABLE" | "ASSIGNED" | "MAINTENANCE" | "RETIRED"
  location?: string
  purchaseDate?: string
}

// Reservation Service Types
export interface BackendReservation {
  id: string
  reservationNumber: string
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
  requestDate: string
  returnDate: string
  actualReturnDate?: string
  requester: {
    id: string
    name: string
    email: string
  }
  items: Array<{
    id: string
    assetType: string
    quantity: number
    assignedAssets?: Array<{
      id: string
      assetTag: string
    }>
  }>
  notes?: string
  rejectionReason?: string
  approvedBy?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

export interface CreateReservationRequest {
  requestDate: string
  returnDate: string
  items: Array<{
    assetType: string
    quantity: number
  }>
  notes?: string
}

export interface ApproveReservationRequest {
  assetIds: string[]
  notes?: string
}
