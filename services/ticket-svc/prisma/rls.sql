-- enable/force RLS on ticket schema tables
ALTER TABLE "ticket"."Ticket" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket"."Ticket" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ticket"."TicketComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket"."TicketComment" FORCE ROW LEVEL SECURITY;

-- tenant policies (quote camelCase)
DROP POLICY IF EXISTS tenant_isolation_ticket ON "ticket"."Ticket";
CREATE POLICY tenant_isolation_ticket ON "ticket"."Ticket"
  USING ("tenantId" = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS tenant_isolation_comment ON "ticket"."TicketComment";
CREATE POLICY tenant_isolation_comment ON "ticket"."TicketComment"
  USING ("tenantId" = current_setting('app.tenant_id', true));
