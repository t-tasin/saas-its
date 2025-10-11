-- ===================================================================
-- CREATE TICKET COUNTER TABLE IN NEON DATABASE
-- ===================================================================
-- This table is used for generating sequential ticket numbers
-- Run this FIRST before trying to fix the counter
-- ===================================================================

-- Create the TicketDayCounter table
CREATE TABLE IF NOT EXISTS "TicketDayCounter" (
  "yymmdd" TEXT PRIMARY KEY,
  "seq" INTEGER NOT NULL
);

-- Insert the initial counter for 2025
-- Set it to 10 since the highest ticket is TKT-2025-000010
INSERT INTO "TicketDayCounter" ("yymmdd", "seq") 
VALUES ('2025', 10)
ON CONFLICT ("yymmdd") DO NOTHING;

-- Verify the table was created
SELECT * FROM "TicketDayCounter";

-- Check existing tickets to confirm the count
SELECT COUNT(*) as total_tickets, MAX("number") as highest_ticket
FROM "Ticket" 
WHERE "number" LIKE 'TKT-2025-%';

-- ===================================================================
-- NEXT: After running this, ticket creation should work!
-- ===================================================================

