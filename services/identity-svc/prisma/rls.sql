-- identity-svc RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure RLS is on and enforced (owner bypass disabled)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" FORCE ROW LEVEL SECURITY;

-- Recreate policy cleanly
DROP POLICY IF EXISTS tenant_isolation_user ON "User";
CREATE POLICY tenant_isolation_user ON "User"
  USING ("tenantId" = current_setting('app.tenant_id', true));
