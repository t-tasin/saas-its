/**
 * Seed Data Script for SaaS ITS
 * Creates test data for tickets and assets via Railway APIs
 */

const RAILWAY_URLS = {
  IDENTITY_API: "https://saas-itsidentity-svc-production.up.railway.app/v1",
  TICKET_API: "https://saas-itsticket-svc-production.up.railway.app/v1",
  ASSET_API: "https://saas-itsasset-svc-production.up.railway.app/v1",
  RESERVATION_API: "https://saas-itsreservation-svc-production.up.railway.app/v1",
}

// Test user credentials (use existing admin account)
const ADMIN_EMAIL = "tasin0.net@gmail.com"
const ADMIN_PASSWORD = "NewSecurePassword123!"

interface AuthToken {
  token: string
  user: any
}

/**
 * Login to get auth token
 */
async function login(): Promise<AuthToken> {
  console.log("🔐 Logging in as admin...")
  
  // Step 1: Login with password
  const loginResponse = await fetch(`${RAILWAY_URLS.IDENTITY_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  })

  const loginData = await loginResponse.json()
  
  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${JSON.stringify(loginData)}`)
  }

  console.log("📧 OTP sent to email. Please check your email and enter the OTP:")
  
  // In a real script, you'd prompt for OTP here
  // For now, we'll throw an error with instructions
  const tempToken = loginData.tempToken
  
  console.log("\nPlease run the verify OTP manually:")
  console.log(`curl -X POST ${RAILWAY_URLS.IDENTITY_API}/auth/verify-otp \\
  -H "Content-Type: application/json" \\
  -d '{"email":"${ADMIN_EMAIL}","otp":"YOUR_OTP","tempToken":"${tempToken}"}'`)
  
  throw new Error("Manual OTP verification required. Use the curl command above, then paste the token below in the script.")
}

/**
 * Create seed tickets
 */
async function seedTickets(token: string) {
  console.log("\n🎫 Creating seed tickets...")

  const tickets = [
    {
      title: "Laptop not turning on",
      description: "My work laptop suddenly stopped working. It was fine yesterday but now it won't turn on at all. I've tried different power outlets and the charging light doesn't come on.",
      type: "incident",
      priority: "high",
      requestedBy: "john.doe@example.com",
    },
    {
      title: "Request new software license",
      description: "Need Adobe Creative Cloud license for the marketing team. We have 5 new members who need access to Photoshop and Illustrator.",
      type: "request",
      priority: "medium",
      requestedBy: "sarah.smith@example.com",
    },
    {
      title: "Email not syncing on mobile",
      description: "My work email stopped syncing on my iPhone. I can receive emails but cannot send them. Desktop email works fine.",
      type: "incident",
      priority: "medium",
      requestedBy: "mike.johnson@example.com",
    },
    {
      title: "VPN connection issues",
      description: "Unable to connect to company VPN from home. Getting 'connection timeout' error. Tried restarting router and computer.",
      type: "incident",
      priority: "urgent",
      requestedBy: "emily.davis@example.com",
    },
    {
      title: "Request access to shared drive",
      description: "Need access to the Finance shared drive folder. My manager approved this request yesterday.",
      type: "request",
      priority: "low",
      requestedBy: "david.wilson@example.com",
    },
    {
      title: "Printer not working",
      description: "Office printer on 3rd floor keeps showing 'paper jam' error even though there's no paper stuck. Multiple people have this issue.",
      type: "incident",
      priority: "medium",
      requestedBy: "lisa.brown@example.com",
    },
    {
      title: "Request new monitor",
      description: "Current monitor has dead pixels and flickering issues. Would like to request a replacement 27-inch monitor.",
      type: "request",
      priority: "low",
      requestedBy: "james.taylor@example.com",
    },
    {
      title: "Cannot access internal dashboard",
      description: "Getting 403 Forbidden error when trying to access the internal analytics dashboard. Was working fine last week.",
      type: "incident",
      priority: "high",
      requestedBy: "jennifer.martinez@example.com",
    },
    {
      title: "Slow computer performance",
      description: "My computer has been extremely slow for the past few days. Takes 5+ minutes to boot up and applications freeze frequently.",
      type: "incident",
      priority: "medium",
      requestedBy: "robert.anderson@example.com",
    },
    {
      title: "Request Microsoft Teams license",
      description: "New employee starting next week needs Microsoft Teams license and access to company channels.",
      type: "request",
      priority: "medium",
      requestedBy: "hr@example.com",
    },
  ]

  let successCount = 0
  let failCount = 0

  for (const ticketData of tickets) {
    try {
      const response = await fetch(`${RAILWAY_URLS.TICKET_API}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`  ✅ Created ticket: ${ticketData.title} (${data.number || data.id})`)
        successCount++
      } else {
        console.error(`  ❌ Failed to create ticket: ${ticketData.title}`, data)
        failCount++
      }
    } catch (error) {
      console.error(`  ❌ Error creating ticket: ${ticketData.title}`, error)
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log(`\n📊 Tickets: ${successCount} created, ${failCount} failed`)
}

/**
 * Create seed assets
 */
async function seedAssets(token: string) {
  console.log("\n💻 Creating seed assets...")

  const assets = [
    {
      assetId: "LAP-2025-001",
      type: "Laptop",
      description: "Dell XPS 15 - High performance laptop for development team",
      fundingDepartment: "Engineering",
      manufacturer: "Dell",
      model: "XPS 15 9530",
      modelGeneration: "2023",
      serialNumber: "DELLXPS001",
      memory: "32GB DDR5",
      hddSize: "1TB",
      hddType: "NVMe SSD",
      cpuGeneration: "13th Gen",
      cpuSpeed: "2.4 GHz",
      location: "Office - Desk 12",
      status: "available",
      cost: 2499.99,
    },
    {
      assetId: "LAP-2025-002",
      type: "Laptop",
      description: "MacBook Pro 16-inch for design team",
      fundingDepartment: "Design",
      manufacturer: "Apple",
      model: "MacBook Pro",
      modelGeneration: "M3 Pro",
      serialNumber: "MBPRO16001",
      memory: "32GB Unified Memory",
      hddSize: "1TB",
      hddType: "SSD",
      location: "Office - Design Pod",
      status: "assigned",
      cost: 3499.99,
    },
    {
      assetId: "MON-2025-001",
      type: "Monitor",
      description: "Dell UltraSharp 27-inch 4K monitor",
      fundingDepartment: "General",
      manufacturer: "Dell",
      model: "U2723DE",
      serialNumber: "DELMON001",
      output1: "DisplayPort",
      output2: "USB-C",
      location: "Office - Desk 5",
      status: "available",
      cost: 699.99,
    },
    {
      assetId: "MON-2025-002",
      type: "Monitor",
      description: "LG UltraWide 34-inch curved monitor",
      fundingDepartment: "Engineering",
      manufacturer: "LG",
      model: "34WK95U-W",
      serialNumber: "LGMON002",
      output1: "HDMI",
      output2: "Thunderbolt 3",
      location: "Office - Desk 8",
      status: "available",
      cost: 899.99,
    },
    {
      assetId: "KEY-2025-001",
      type: "Keyboard",
      description: "Mechanical keyboard - Cherry MX switches",
      fundingDepartment: "Engineering",
      manufacturer: "Keychron",
      model: "K8 Pro",
      location: "Storage Room A",
      status: "available",
      cost: 119.99,
    },
    {
      assetId: "MOU-2025-001",
      type: "Mouse",
      description: "Wireless ergonomic mouse",
      fundingDepartment: "General",
      manufacturer: "Logitech",
      model: "MX Master 3S",
      location: "Storage Room A",
      status: "available",
      cost: 99.99,
    },
    {
      assetId: "DOC-2025-001",
      type: "Docking Station",
      description: "USB-C docking station with dual monitor support",
      fundingDepartment: "General",
      manufacturer: "CalDigit",
      model: "TS4",
      serialNumber: "CALDOC001",
      location: "Office - Desk 15",
      status: "assigned",
      cost: 399.99,
    },
    {
      assetId: "TAB-2025-001",
      type: "Tablet",
      description: "iPad Pro for field work",
      fundingDepartment: "Operations",
      manufacturer: "Apple",
      model: "iPad Pro 12.9",
      modelGeneration: "6th Gen",
      serialNumber: "IPADPRO001",
      memory: "8GB",
      hddSize: "256GB",
      location: "Field Equipment Locker",
      status: "available",
      cost: 1199.99,
    },
    {
      assetId: "WEB-2025-001",
      type: "Webcam",
      description: "4K webcam for conference rooms",
      fundingDepartment: "General",
      manufacturer: "Logitech",
      model: "Brio 4K",
      location: "Conference Room A",
      status: "available",
      cost: 199.99,
    },
    {
      assetId: "PRO-2025-001",
      type: "Projector",
      description: "Portable projector for presentations",
      fundingDepartment: "Sales",
      manufacturer: "Epson",
      model: "PowerLite 2250U",
      serialNumber: "EPSOPRO001",
      location: "Conference Room B",
      status: "maintenance",
      cost: 1499.99,
    },
  ]

  let successCount = 0
  let failCount = 0

  for (const assetData of assets) {
    try {
      const response = await fetch(`${RAILWAY_URLS.ASSET_API}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(assetData),
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`  ✅ Created asset: ${assetData.assetId} - ${assetData.type}`)
        successCount++
      } else {
        console.error(`  ❌ Failed to create asset: ${assetData.assetId}`, data)
        failCount++
      }
    } catch (error) {
      console.error(`  ❌ Error creating asset: ${assetData.assetId}`, error)
      failCount++
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  console.log(`\n📊 Assets: ${successCount} created, ${failCount} failed`)
}

/**
 * Main function
 */
async function main() {
  console.log("🌱 Starting seed data creation...\n")
  
  // For now, you need to manually provide the token
  // You can get it by:
  // 1. Login to the web app
  // 2. Open browser console
  // 3. Type: localStorage.getItem('authToken')
  
  const token = process.argv[2]
  
  if (!token) {
    console.error("❌ Error: No auth token provided")
    console.log("\nUsage: npm run seed -- <your-auth-token>")
    console.log("\nTo get your token:")
    console.log("1. Login to the web app (http://localhost:3000/login)")
    console.log("2. Open browser console (F12)")
    console.log("3. Type: localStorage.getItem('authToken')")
    console.log("4. Copy the token and run: npm run seed -- <token>\n")
    process.exit(1)
  }

  try {
    await seedTickets(token)
    await seedAssets(token)
    
    console.log("\n✅ Seed data creation complete!")
  } catch (error) {
    console.error("\n❌ Error during seeding:", error)
    process.exit(1)
  }
}

// Run the script
main()

