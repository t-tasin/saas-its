import { type NextRequest, NextResponse } from "next/server"

const getBackendUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_IDENTITY_API || "http://localhost:3000"
  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`
  return url.endsWith("/v1") ? url : `${url}/v1`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = getBackendUrl()
    const fullUrl = `${backendUrl}/auth/request-otp`

    console.log("[v0] Proxy forwarding to:", fullUrl)
    console.log("[v0] Request body:", body)

    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[v0] Backend response:", { status: response.status, data })

    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("[v0] Request OTP proxy error:", error)
    return NextResponse.json({ error: "OTP request failed", message: error.message }, { status: 500 })
  }
}
