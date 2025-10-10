import { type NextRequest, NextResponse } from "next/server"

const getBackendUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_IDENTITY_API || "http://localhost:3000"
  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
  const finalUrl = url.endsWith("/v1") ? url : `${url}/v1`
  console.log("[v0] [SERVER] Backend URL constructed:", finalUrl)
  return finalUrl
}

export async function POST(request: NextRequest) {
  console.log("[v0] [SERVER] Register proxy route HIT!")

  try {
    const body = await request.json()
    console.log("[v0] [SERVER] Request body received:", body)

    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/auth/register`

    console.log("[v0] [SERVER] Forwarding to backend:", fullUrl)
    console.log("[v0] [SERVER] Payload:", JSON.stringify(body))

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] [SERVER] Backend response status:", response.status)

    const data = await response.json()
    console.log("[v0] [SERVER] Backend response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] [SERVER] Register proxy error:", error.message)
    console.error("[v0] [SERVER] Error stack:", error.stack)
    return NextResponse.json({ error: "Registration failed", message: error.message }, { status: 500 })
  }
}
