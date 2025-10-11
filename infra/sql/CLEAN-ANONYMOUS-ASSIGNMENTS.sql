-- Clean up assets and reservations with invalid 'anonymous' user assignments
-- Run this SQL on your Neon database

-- Update assets that are assigned to 'anonymous' to be available
UPDATE asset."Asset"
SET 
  "assignedToId" = NULL,
  "assignedDate" = NULL,
  status = 'available'
WHERE "assignedToId" = 'anonymous';

-- Update reservations with 'anonymous' requesterId to use a real user
-- First, get your admin user ID:
SELECT id, email, name FROM identity."User" WHERE role = 'admin' LIMIT 1;

-- Then update reservations (replace YOUR_ADMIN_ID with the ID from above)
-- UPDATE reservation."Reservation"
-- SET "requesterId" = 'YOUR_ADMIN_ID_HERE'
-- WHERE "requesterId" = 'anonymous';

-- Or just delete test reservations with anonymous:
DELETE FROM reservation."Reservation" WHERE "requesterId" = 'anonymous';

-- Verify cleanup
SELECT * FROM asset."Asset" WHERE "assignedToId" = 'anonymous';
SELECT * FROM reservation."Reservation" WHERE "requesterId" = 'anonymous';

