-- ===================================================================
-- UPDATE EXISTING USERS TO HAVE NAMES (For Neon Database)
-- ===================================================================
-- This script updates users with null names before making name required
-- Run this in your Neon SQL Editor in the "identity" schema
-- ===================================================================

-- Step 1: Set search path to identity schema
SET search_path TO identity;

-- Step 2: Check current users with null names
SELECT id, email, name, role 
FROM "User" 
WHERE name IS NULL;

-- Step 3: Update users with null names to have a default name based on email
-- This extracts the part before @ and titlecases it
UPDATE "User"
SET name = INITCAP(SPLIT_PART(email, '@', 1))
WHERE name IS NULL;

-- Step 4: Verify all users now have names
SELECT id, email, name, role 
FROM "User" 
WHERE name IS NULL;
-- This should return 0 rows

-- Step 5: Check all users to confirm
SELECT email, name, role 
FROM "User" 
ORDER BY "createdAt";

-- ===================================================================
-- AFTER RUNNING THIS SQL:
-- 1. All users will have names
-- 2. You can now deploy the updated identity service
-- 3. Prisma will update the schema to make name non-nullable
-- ===================================================================

