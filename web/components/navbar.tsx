"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Headset, User, LogOut, LayoutDashboard, Ticket, Calendar, Package, Users, Menu } from "lucide-react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent hydration mismatch by only showing auth-dependent UI after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Headset className="h-6 w-6" />
            <span>IT Helpdesk</span>
          </Link>

          <div className="flex items-center gap-4">
            {!mounted ? (
              // Show nothing during SSR to prevent hydration mismatch
              <div className="h-9 w-32" />
            ) : isAuthenticated ? (
              <>
                {/* Navigation Links for Operator/Admin - Desktop */}
                {(user?.role === "operator" || user?.role === "admin") && (
                  <div className="hidden md:flex items-center gap-2">
                    {user?.role === "admin" && (
                      <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard/tickets">
                      <Button variant="ghost" size="sm">
                        <Ticket className="h-4 w-4 mr-2" />
                        Tickets
                      </Button>
                    </Link>
                    <Link href="/dashboard/reservations">
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Reservations
                      </Button>
                    </Link>
                    <Link href="/dashboard/assets">
                      <Button variant="ghost" size="sm">
                        <Package className="h-4 w-4 mr-2" />
                        Assets
                      </Button>
                    </Link>
                    {user?.role === "admin" && (
                      <Link href="/dashboard/users">
                        <Button variant="ghost" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Users
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* User Dashboard Link for general users - Desktop */}
                {user?.role === "general" && (
                  <Link href="/dashboard" className="hidden md:block">
                    <Button variant="ghost" size="sm">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      My Dashboard
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu - Hamburger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle>Menu</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-6">
                      {/* General User Navigation */}
                      {user?.role === "general" && (
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            My Dashboard
                          </Button>
                        </Link>
                      )}

                      {/* Operator/Admin Navigation */}
                      {(user?.role === "operator" || user?.role === "admin") && (
                        <>
                          {user?.role === "admin" && (
                            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start">
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                              </Button>
                            </Link>
                          )}
                          <Link href="/dashboard/tickets" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Ticket className="h-4 w-4 mr-2" />
                              Tickets
                            </Button>
                          </Link>
                          <Link href="/dashboard/reservations" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              Reservations
                            </Button>
                          </Link>
                          <Link href="/dashboard/assets" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Package className="h-4 w-4 mr-2" />
                              Assets
                            </Button>
                          </Link>
                          {user?.role === "admin" && (
                            <Link href="/dashboard/users" onClick={() => setMobileMenuOpen(false)}>
                              <Button variant="ghost" className="w-full justify-start">
                                <Users className="h-4 w-4 mr-2" />
                                Users
                              </Button>
                            </Link>
                          )}
                        </>
                      )}

                      <div className="border-t pt-4 mt-4">
                        <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={() => {
                            setMobileMenuOpen(false)
                            logout()
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Profile Dropdown - Desktop */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/users">
                          <Users className="h-4 w-4 mr-2" />
                          User Management
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
