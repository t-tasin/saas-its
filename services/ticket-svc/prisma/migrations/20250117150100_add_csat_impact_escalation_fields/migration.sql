-- Migration: Add CSAT, Impact Level, and Escalation tracking to Ticket model
-- Created: 2025-01-17
-- Description: Adds customer feedback (CSAT), business impact levels, and auto-escalation tracking

-- Create ImpactLevel enum
CREATE TYPE "ticket"."ImpactLevel" AS ENUM ('P1', 'P2', 'P3', 'P4');

-- Add new columns to Ticket table
ALTER TABLE "ticket"."Ticket"
  -- Customer Feedback (CSAT)
  ADD COLUMN "csat" INTEGER,
  ADD COLUMN "csatComment" TEXT,
  ADD COLUMN "csatSubmittedAt" TIMESTAMP(3),

  -- Business Impact Level
  ADD COLUMN "impactLevel" "ticket"."ImpactLevel" DEFAULT 'P4',

  -- Auto-escalation tracking
  ADD COLUMN "escalationCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastEscalatedAt" TIMESTAMP(3),
  ADD COLUMN "escalationReason" TEXT;

-- Add constraints
ALTER TABLE "ticket"."Ticket"
  ADD CONSTRAINT "csat_range_check" CHECK ("csat" IS NULL OR ("csat" >= 1 AND "csat" <= 5));

-- Add indexes for performance
CREATE INDEX "Ticket_impactLevel_idx" ON "ticket"."Ticket"("impactLevel");
CREATE INDEX "Ticket_escalationCount_idx" ON "ticket"."Ticket"("escalationCount");
CREATE INDEX "Ticket_csatSubmittedAt_idx" ON "ticket"."Ticket"("csatSubmittedAt");

-- Add comments for documentation
COMMENT ON COLUMN "ticket"."Ticket"."csat" IS 'Customer Satisfaction Score (1-5 scale)';
COMMENT ON COLUMN "ticket"."Ticket"."csatComment" IS 'Optional feedback comment from customer';
COMMENT ON COLUMN "ticket"."Ticket"."csatSubmittedAt" IS 'Timestamp when CSAT feedback was submitted';
COMMENT ON COLUMN "ticket"."Ticket"."impactLevel" IS 'Business impact level: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)';
COMMENT ON COLUMN "ticket"."Ticket"."escalationCount" IS 'Number of times ticket has been escalated';
COMMENT ON COLUMN "ticket"."Ticket"."lastEscalatedAt" IS 'Timestamp of most recent escalation';
COMMENT ON COLUMN "ticket"."Ticket"."escalationReason" IS 'Reason for last escalation (sla_breach, impact_level, manual)';
