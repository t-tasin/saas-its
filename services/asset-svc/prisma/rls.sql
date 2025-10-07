-- Enforce RLS on both tables in the asset schema
ALTER TABLE "asset"."Asset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "asset"."AssetAssignment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "asset"."Asset" FORCE ROW LEVEL SECURITY;
ALTER TABLE "asset"."AssetAssignment" FORCE ROW LEVEL SECURITY;

-- Tenant policies (quote camelCase + qualify schema)
DROP POLICY IF EXISTS tenant_isolation_asset ON "asset"."Asset";
CREATE POLICY tenant_isolation_asset ON "asset"."Asset"
  USING ("tenantId" = current_setting('app.tenant_id', true));

DROP POLICY IF EXISTS tenant_isolation_assignment ON "asset"."AssetAssignment";
CREATE POLICY tenant_isolation_assignment ON "asset"."AssetAssignment"
  USING ("tenantId" = current_setting('app.tenant_id', true));

-- Only one active assignment per asset per tenant (partial unique index)
-- Index name is local to the schema, so reuse the same name safely
CREATE UNIQUE INDEX IF NOT EXISTS ux_one_active_assignment_per_asset
  ON "asset"."AssetAssignment" ("tenantId","assetId")
  WHERE "unassignedAt" IS NULL;
