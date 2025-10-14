-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ticket";

-- CreateEnum
CREATE TYPE "ticket"."TicketStatus" AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "ticket"."TicketType" AS ENUM ('incident', 'request');

-- CreateEnum
CREATE TYPE "ticket"."TicketPriority" AS ENUM ('low', 'medium', 'high', 'urgent');

-- CreateTable
CREATE TABLE "ticket"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket"."SubCategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket"."Ticket" (
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

-- CreateTable
CREATE TABLE "ticket"."TicketComment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT,
    "authorRole" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket"."TicketDayCounter" (
    "yymmdd" TEXT NOT NULL,
    "seq" INTEGER NOT NULL,

    CONSTRAINT "TicketDayCounter_pkey" PRIMARY KEY ("yymmdd")
);

-- CreateTable
CREATE TABLE "ticket"."AuditLog" (
    "id" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorId" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "ticket"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_categoryId_name_key" ON "ticket"."SubCategory"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_number_key" ON "ticket"."Ticket"("number");

-- CreateIndex
CREATE INDEX "Ticket_status_updatedAt_idx" ON "ticket"."Ticket"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "Ticket_assignedTo_idx" ON "ticket"."Ticket"("assignedTo");

-- CreateIndex
CREATE INDEX "Ticket_assetId_idx" ON "ticket"."Ticket"("assetId");

-- CreateIndex
CREATE INDEX "Ticket_createdAt_idx" ON "ticket"."Ticket"("createdAt");

-- CreateIndex
CREATE INDEX "TicketComment_ticketId_createdAt_idx" ON "ticket"."TicketComment"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_at_idx" ON "ticket"."AuditLog"("entity", "entityId", "at");

-- AddForeignKey
ALTER TABLE "ticket"."SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ticket"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket"."Ticket" ADD CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ticket"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket"."Ticket" ADD CONSTRAINT "Ticket_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "ticket"."SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket"."TicketComment" ADD CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "ticket"."Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
