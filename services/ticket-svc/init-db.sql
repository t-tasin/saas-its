-- Database initialization script for ticket-svc
-- This script creates the necessary schema and tables

-- Create the ticket schema
CREATE SCHEMA IF NOT EXISTS "ticket";

-- Create enums
DO $$ BEGIN
    CREATE TYPE "ticket"."TicketStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ticket"."TicketType" AS ENUM ('incident', 'request');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ticket"."TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS "ticket"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ticket"."SubCategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ticket"."Ticket" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ticket"."TicketType" NOT NULL DEFAULT 'incident',
    "status" "ticket"."TicketStatus" NOT NULL DEFAULT 'open',
    "priority" "ticket"."TicketPriority" NOT NULL DEFAULT 'medium',
    "requestedBy" TEXT,
    "requestedByUser" TEXT,
    "requesterName" TEXT,
    "requesterEmail" TEXT,
    "assignedTo" TEXT,
    "assignedTechnicians" JSONB DEFAULT '[]',
    "assetId" TEXT,
    "categoryId" TEXT,
    "subcategoryId" TEXT,
    "targetDate" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "attachments" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ticket"."TicketComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "authorRole" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ticket"."TicketDayCounter" (
    "yymmdd" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,
    CONSTRAINT "TicketDayCounter_pkey" PRIMARY KEY ("yymmdd")
);

CREATE TABLE IF NOT EXISTS "ticket"."AuditLog" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "ticket"."Category"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "SubCategory_categoryId_name_key" ON "ticket"."SubCategory"("categoryId", "name");
CREATE UNIQUE INDEX IF NOT EXISTS "Ticket_number_key" ON "ticket"."Ticket"("number");
CREATE INDEX IF NOT EXISTS "Ticket_status_updatedAt_idx" ON "ticket"."Ticket"("status", "updatedAt");
CREATE INDEX IF NOT EXISTS "Ticket_assignedTo_idx" ON "ticket"."Ticket"("assignedTo");
CREATE INDEX IF NOT EXISTS "Ticket_assetId_idx" ON "ticket"."Ticket"("assetId");
CREATE INDEX IF NOT EXISTS "Ticket_createdAt_idx" ON "ticket"."Ticket"("createdAt");
CREATE INDEX IF NOT EXISTS "TicketComment_ticketId_createdAt_idx" ON "ticket"."TicketComment"("ticketId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditLog_entity_entityId_at_idx" ON "ticket"."AuditLog"("entity", "entityId", "at");

-- Add foreign keys
DO $$ BEGIN
    ALTER TABLE "ticket"."SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ticket"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ticket"."Ticket" ADD CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ticket"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ticket"."Ticket" ADD CONSTRAINT "Ticket_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "ticket"."SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "ticket"."TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert some default categories
INSERT INTO "ticket"."Category" ("id", "name") VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Hardware Issues'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Software Issues'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Network Issues'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Account Issues')
ON CONFLICT ("id") DO NOTHING;

-- Insert some default subcategories
INSERT INTO "ticket"."SubCategory" ("id", "categoryId", "name") VALUES 
    ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Laptop Issues'),
    ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Desktop Issues'),
    ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440001', 'Peripheral Issues'),
    ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'Application Issues'),
    ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Operating System Issues'),
    ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 'Installation Issues')
ON CONFLICT ("id") DO NOTHING;
