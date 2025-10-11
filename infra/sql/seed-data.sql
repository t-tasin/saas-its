-- ============================================
-- SaaS ITS - Seed Data SQL Script
-- ============================================
-- Run this directly in Neon SQL Console
-- No authentication needed!
-- ============================================

-- ============================================
-- TICKET SERVICE DATA
-- ============================================

-- Set search path to ticket schema (or use schema-qualified names)
SET search_path TO ticket;

-- Sample Tickets
INSERT INTO ticket."Ticket" (
  id, 
  number, 
  title, 
  description, 
  type, 
  status, 
  priority, 
  "requestedBy",
  "requesterEmail",
  "createdAt",
  "updatedAt"
) VALUES
  (
    gen_random_uuid(),
    'TKT-2025-000001',
    'Laptop not turning on',
    'My work laptop suddenly stopped working. It was fine yesterday but now it won''t turn on at all. I''ve tried different power outlets and the charging light doesn''t come on.',
    'incident',
    'open',
    'high',
    'John Doe',
    'john.doe@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000002',
    'Request new software license',
    'Need Adobe Creative Cloud license for the marketing team. We have 5 new members who need access to Photoshop and Illustrator.',
    'request',
    'open',
    'medium',
    'Sarah Smith',
    'sarah.smith@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000003',
    'Email not syncing on mobile',
    'My work email stopped syncing on my iPhone. I can receive emails but cannot send them. Desktop email works fine.',
    'incident',
    'in_progress',
    'medium',
    'Mike Johnson',
    'mike.johnson@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000004',
    'VPN connection issues',
    'Unable to connect to company VPN from home. Getting ''connection timeout'' error. Tried restarting router and computer.',
    'incident',
    'open',
    'urgent',
    'Emily Davis',
    'emily.davis@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000005',
    'Request access to shared drive',
    'Need access to the Finance shared drive folder. My manager approved this request yesterday.',
    'request',
    'open',
    'low',
    'David Wilson',
    'david.wilson@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000006',
    'Printer not working',
    'Office printer on 3rd floor keeps showing ''paper jam'' error even though there''s no paper stuck. Multiple people have this issue.',
    'incident',
    'open',
    'medium',
    'Lisa Brown',
    'lisa.brown@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000007',
    'Request new monitor',
    'Current monitor has dead pixels and flickering issues. Would like to request a replacement 27-inch monitor.',
    'request',
    'open',
    'low',
    'James Taylor',
    'james.taylor@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000008',
    'Cannot access internal dashboard',
    'Getting 403 Forbidden error when trying to access the internal analytics dashboard. Was working fine last week.',
    'incident',
    'open',
    'high',
    'Jennifer Martinez',
    'jennifer.martinez@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000009',
    'Slow computer performance',
    'My computer has been extremely slow for the past few days. Takes 5+ minutes to boot up and applications freeze frequently.',
    'incident',
    'resolved',
    'medium',
    'Robert Anderson',
    'robert.anderson@example.com',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TKT-2025-000010',
    'Request Microsoft Teams license',
    'New employee starting next week needs Microsoft Teams license and access to company channels.',
    'request',
    'open',
    'medium',
    'HR Department',
    'hr@example.com',
    NOW(),
    NOW()
  );

-- ============================================
-- ASSET SERVICE DATA
-- ============================================

-- Set search path to asset schema
SET search_path TO asset;

-- Sample Assets
INSERT INTO asset."Asset" (
  id,
  "assetId",
  type,
  description,
  "fundingDepartment",
  manufacturer,
  model,
  "modelGeneration",
  "serialNumber",
  memory,
  "hddSize",
  "hddType",
  "cpuGeneration",
  "cpuSpeed",
  location,
  status,
  cost,
  "createdAt",
  "updatedAt"
) VALUES
  (
    gen_random_uuid(),
    'LAP-2025-001',
    'Laptop',
    'Dell XPS 15 - High performance laptop for development team',
    'Engineering',
    'Dell',
    'XPS 15 9530',
    '2023',
    'DELLXPS001',
    '32GB DDR5',
    '1TB',
    'NVMe SSD',
    '13th Gen',
    '2.4 GHz',
    'Office - Desk 12',
    'available',
    2499.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'LAP-2025-002',
    'Laptop',
    'MacBook Pro 16-inch for design team',
    'Design',
    'Apple',
    'MacBook Pro',
    'M3 Pro',
    'MBPRO16001',
    '32GB Unified Memory',
    '1TB',
    'SSD',
    NULL,
    NULL,
    'Office - Design Pod',
    'assigned',
    3499.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'MON-2025-001',
    'Monitor',
    'Dell UltraSharp 27-inch 4K monitor',
    'General',
    'Dell',
    'U2723DE',
    NULL,
    'DELMON001',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Office - Desk 5',
    'available',
    699.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'MON-2025-002',
    'Monitor',
    'LG UltraWide 34-inch curved monitor',
    'Engineering',
    'LG',
    '34WK95U-W',
    NULL,
    'LGMON002',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Office - Desk 8',
    'available',
    899.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'KEY-2025-001',
    'Keyboard',
    'Mechanical keyboard - Cherry MX switches',
    'Engineering',
    'Keychron',
    'K8 Pro',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Storage Room A',
    'available',
    119.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'MOU-2025-001',
    'Mouse',
    'Wireless ergonomic mouse',
    'General',
    'Logitech',
    'MX Master 3S',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Storage Room A',
    'available',
    99.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'DOC-2025-001',
    'Docking Station',
    'USB-C docking station with dual monitor support',
    'General',
    'CalDigit',
    'TS4',
    NULL,
    'CALDOC001',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Office - Desk 15',
    'assigned',
    399.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'TAB-2025-001',
    'Tablet',
    'iPad Pro for field work',
    'Operations',
    'Apple',
    'iPad Pro 12.9',
    '6th Gen',
    'IPADPRO001',
    '8GB',
    '256GB',
    NULL,
    NULL,
    NULL,
    'Field Equipment Locker',
    'available',
    1199.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'WEB-2025-001',
    'Webcam',
    '4K webcam for conference rooms',
    'General',
    'Logitech',
    'Brio 4K',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Conference Room A',
    'available',
    199.99,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'PRO-2025-001',
    'Projector',
    'Portable projector for presentations',
    'Sales',
    'Epson',
    'PowerLite 2250U',
    NULL,
    'EPSOPRO001',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Conference Room B',
    'maintenance',
    1499.99,
    NOW(),
    NOW()
  );

-- ============================================
-- RESERVATION SERVICE DATA
-- ============================================

-- Set search path to reservation schema
SET search_path TO reservation;

-- Sample Reservations
INSERT INTO reservation."Reservation" (
  id,
  "reservationNumber",
  "requesterId",
  "requesterEmail",
  "requesterName",
  "equipmentType",
  quantity,
  purpose,
  status,
  "requestDate",
  "returnDate",
  "createdAt",
  "updatedAt"
) VALUES
  (
    gen_random_uuid(),
    'RES-2025-001',
    'user-123',
    'alice.cooper@example.com',
    'Alice Cooper',
    'LAPTOP',
    1,
    'Client presentation at downtown office',
    'pending',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '5 days',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'RES-2025-002',
    'user-456',
    'bob.smith@example.com',
    'Bob Smith',
    'PROJECTOR',
    1,
    'Team training session',
    'approved',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '3 days',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'RES-2025-003',
    'user-789',
    'carol.white@example.com',
    'Carol White',
    'LAPTOP',
    2,
    'Conference booth setup',
    'pending',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '10 days',
    NOW(),
    NOW()
  );

-- ============================================
-- SUCCESS!
-- ============================================

SELECT 'Seed data inserted successfully!' AS message;

