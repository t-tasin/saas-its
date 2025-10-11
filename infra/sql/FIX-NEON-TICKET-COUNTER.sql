-- ===================================================================
-- FIX TICKET COUNTER FOR NEON DATABASE
-- ===================================================================
-- Problem: Counter is stuck at 10, causing "Unique constraint violated"
-- Solution: Update counter to be higher than the current max ticket number
-- ===================================================================

-- Step 1: Check current state of the counter
SELECT * FROM "TicketDayCounter";

-- Step 2: Check the highest ticket number in the system
SELECT "number" FROM "Ticket" 
WHERE "number" LIKE 'TKT-2025-%' 
ORDER BY "number" DESC 
LIMIT 5;

-- Step 3: Count total tickets for 2025
SELECT COUNT(*) as total_tickets 
FROM "Ticket" 
WHERE "number" LIKE 'TKT-2025-%';

-- ===================================================================
-- MAIN FIX: Update the counter to correct value
-- ===================================================================
-- This extracts the number from TKT-2025-000010 (gets 10) and sets counter to 11
UPDATE "TicketDayCounter" 
SET seq = (
  SELECT CAST(
    SUBSTRING(MAX("number"), 10, 6) AS INTEGER
  ) 
  FROM "Ticket" 
  WHERE "number" LIKE 'TKT-2025-%'
)
WHERE yymmdd = '2025';

-- Step 4: Verify the counter is now correct
SELECT * FROM "TicketDayCounter";

-- Expected result: seq should be 10 (the max ticket number)
-- Next ticket will increment it to 11

-- ===================================================================
-- ALTERNATIVE: If you want to be extra safe, set it higher
-- ===================================================================
-- Uncomment this if you want to set counter to 11 or higher manually:
-- UPDATE "TicketDayCounter" SET seq = 11 WHERE yymmdd = '2025';

-- ===================================================================
-- CLEANUP: If counter doesn't exist, create it
-- ===================================================================
-- If the counter row doesn't exist at all, create it:
-- INSERT INTO "TicketDayCounter" (yymmdd, seq) 
-- VALUES ('2025', 10)
-- ON CONFLICT (yymmdd) DO NOTHING;

