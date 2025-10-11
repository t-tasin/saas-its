import { NextRequest, NextResponse } from "next/server"

const IDENTITY_API_URL = process.env.NEXT_PUBLIC_IDENTITY_API || "https://saas-itsidentity-svc-production.up.railway.app/v1"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params
  const path = pathArray.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${IDENTITY_API_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error(`[Auth Proxy] Error fetching ${url}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params
  const path = pathArray.join("/")
  const url = `${IDENTITY_API_URL}/${path}`

  try {
    const body = await request.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error(`[Auth Proxy] Error posting to ${url}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params
  const path = pathArray.join("/")
  const url = `${IDENTITY_API_URL}/${path}`

  try {
    const body = await request.json()

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error(`[Auth Proxy] Error patching ${url}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params
  const path = pathArray.join("/")
  const url = `${IDENTITY_API_URL}/${path}`

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const authHeader = request.headers.get("authorization")
    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(url, {
      method: "DELETE",
      headers,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error(`[Auth Proxy] Error deleting ${url}:`, error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

