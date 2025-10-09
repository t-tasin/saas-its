"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Ticket, Calendar, Package, FolderTree, BarChart3, Users, Settings, User } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    href: "/dashboard/tickets",
    icon: Ticket,
    roles: ["operator", "admin"],
  },
  {
    title: "Reservations",
    href: "/dashboard/reservations",
    icon: Calendar,
    roles: ["operator", "admin"],
  },
  {
    title: "Assets",
    href: "/dashboard/assets",
    icon: Package,
    roles: ["operator", "admin"],
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
    roles: ["operator", "admin"],
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    roles: ["admin"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true
    return item.roles.includes(user?.role || "")
  })

  return (
    <aside className="w-64 border-r bg-card min-h-screen">
      <nav className="p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
