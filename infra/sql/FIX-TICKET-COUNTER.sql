-- Fix ticket counter to be at the correct value
-- Run this on Railway database if ticket creation is still failing

-- First, check current state
SELECT * FROM "TicketDayCounter";

-- Get the highest ticket number
SELECT MAX("number") FROM "Ticket" WHERE "number" LIKE 'TKT-2025-%';

-- Count total tickets for 2025
SELECT COUNT(*) FROM "Ticket" WHERE "number" LIKE 'TKT-2025-%';

-- Update counter to be higher than the current max
-- If max is TKT-2025-000010, set counter to 11
UPDATE "TicketDayCounter" 
SET seq = (
  SELECT CAST(SUBSTRING(MAX("number") FROM 10) AS INTEGER) + 1
  FROM "Ticket" 
  WHERE "number" LIKE 'TKT-2025-%'
)
WHERE yymmdd = '2025';

-- Verify the update
SELECT * FROM "TicketDayCounter";

-- Alternative: Delete the counter row to let it start fresh
-- DELETE FROM "TicketDayCounter" WHERE yymmdd = '2025';

