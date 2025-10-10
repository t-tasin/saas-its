import { type NextRequest, NextResponse } from "next/server"

const getBackendUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_RESERVATION_API || "http://localhost:3003"
  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
  return url.endsWith("/v1") ? url : `${url}/v1`
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const backendUrl = getBackendUrl()
    const searchParams = request.nextUrl.searchParams.toString()
    const fullUrl = `${backendUrl}/${path}${searchParams ? `?${searchParams}` : ""}`

    const token = request.headers.get("authorization")
    const tenantId = request.headers.get("x-tenant-id")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = token
    if (tenantId) headers["X-Tenant-ID"] = tenantId

    console.log("[v0] Reservation proxy GET:", fullUrl)

    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Reservation proxy GET error:", error)
    return NextResponse.json({ error: "Request failed", message: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/${path}`

    const body = await request.json()
    const token = request.headers.get("authorization")
    const tenantId = request.headers.get("x-tenant-id")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = token
    if (tenantId) headers["X-Tenant-ID"] = tenantId

    console.log("[v0] Reservation proxy POST:", fullUrl, body)

    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Reservation proxy POST error:", error)
    return NextResponse.json({ error: "Request failed", message: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/${path}`

    const body = await request.json()
    const token = request.headers.get("authorization")
    const tenantId = request.headers.get("x-tenant-id")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = token
    if (tenantId) headers["X-Tenant-ID"] = tenantId

    console.log("[v0] Reservation proxy PUT:", fullUrl, body)

    const response = await fetch(fullUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Reservation proxy PUT error:", error)
    return NextResponse.json({ error: "Request failed", message: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/${path}`

    const body = await request.json()
    const token = request.headers.get("authorization")
    const tenantId = request.headers.get("x-tenant-id")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = token
    if (tenantId) headers["X-Tenant-ID"] = tenantId

    console.log("[v0] Reservation proxy PATCH:", fullUrl, body)

    const response = await fetch(fullUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Reservation proxy PATCH error:", error)
    return NextResponse.json({ error: "Request failed", message: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join("/")
    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/${path}`

    const token = request.headers.get("authorization")
    const tenantId = request.headers.get("x-tenant-id")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    if (token) headers["Authorization"] = token
    if (tenantId) headers["X-Tenant-ID"] = tenantId

    console.log("[v0] Reservation proxy DELETE:", fullUrl)

    const response = await fetch(fullUrl, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Reservation proxy DELETE error:", error)
    return NextResponse.json({ error: "Request failed", message: error.message }, { status: 500 })
  }
}

