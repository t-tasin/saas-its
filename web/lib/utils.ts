import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusColor(status: string, type: "ticket" | "reservation" | "asset" = "ticket"): string {
  if (type === "ticket") {
    const colors: Record<string, string> = {
      open: "bg-blue-500",
      in_progress: "bg-amber-500",
      resolved: "bg-green-500",
      closed: "bg-gray-500",
    }
    return colors[status] || "bg-gray-500"
  }

  if (type === "reservation") {
    const colors: Record<string, string> = {
      pending: "bg-amber-500",
      approved: "bg-green-500",
      denied: "bg-red-500",
      active: "bg-blue-500",
      returned: "bg-gray-500",
      cancelled: "bg-gray-400",
    }
    return colors[status] || "bg-gray-500"
  }

  if (type === "asset") {
    const colors: Record<string, string> = {
      available: "bg-green-500",
      assigned: "bg-blue-500",
      maintenance: "bg-amber-500",
      retired: "bg-gray-500",
    }
    return colors[status] || "bg-gray-500"
  }

  return "bg-gray-500"
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  }
  return colors[priority] || "bg-gray-500"
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatStatus(status: string): string {
  return status.split("_").map(capitalizeFirst).join(" ")
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "min" : "mins"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}
