-- ===================================================================
-- CREATE TICKET COUNTER TABLE IN NEON DATABASE (WITH SCHEMA)
-- ===================================================================
-- This table is used for generating sequential ticket numbers
-- Run this in the 'ticket' schema
-- ===================================================================

-- Set the search path to the ticket schema
SET search_path TO ticket;

-- OR use fully qualified table names with ticket. prefix

-- Create the TicketDayCounter table in the ticket schema
CREATE TABLE IF NOT EXISTS ticket."TicketDayCounter" (
  "yymmdd" TEXT PRIMARY KEY,
  "seq" INTEGER NOT NULL
);

-- Check existing tickets to determine the counter value
SELECT COUNT(*) as total_tickets, MAX("number") as highest_ticket
FROM ticket."Ticket" 
WHERE "number" LIKE 'TKT-2025-%';

-- Insert the initial counter for 2025
-- Set it to 10 since the highest ticket is TKT-2025-000010
INSERT INTO ticket."TicketDayCounter" ("yymmdd", "seq") 
VALUES ('2025', 10)
ON CONFLICT ("yymmdd") DO NOTHING;

-- Verify the table was created
SELECT * FROM ticket."TicketDayCounter";

-- ===================================================================
-- ALTERNATIVE: If the counter should start fresh at 11
-- ===================================================================
-- DELETE FROM ticket."TicketDayCounter" WHERE "yymmdd" = '2025';
-- INSERT INTO ticket."TicketDayCounter" ("yymmdd", "seq") VALUES ('2025', 10);

-- ===================================================================
-- NEXT: After running this, ticket creation should work!
-- ===================================================================

