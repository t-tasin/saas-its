# User Name Field - Deployment Guide

## 🚨 IMPORTANT: Breaking Change

The `name` field in the `User` model is now **required** (non-nullable). You must follow these steps **IN ORDER** before deploying the updated identity service.

---

## 📋 Step-by-Step Deployment

### **Step 1: Update Existing Users in Neon Database**

**⚠️ DO THIS FIRST - Before deploying to Railway!**

1. **Open your Neon SQL Editor**
2. **Run the SQL from `infra/sql/UPDATE-USER-NAMES.sql`**:

```sql
-- Set search path to identity schema
SET search_path TO identity;

-- Check current users with null names
SELECT id, email, name, role 
FROM "User" 
WHERE name IS NULL;

-- Update users with null names to have a default name based on email
UPDATE "User"
SET name = INITCAP(SPLIT_PART(email, '@', 1))
WHERE name IS NULL;

-- Verify all users now have names (should return 0 rows)
SELECT id, email, name, role 
FROM "User" 
WHERE name IS NULL;

-- Check all users to confirm
SELECT email, name, role 
FROM "User" 
ORDER BY "createdAt";
```

3. **Verify**: The last query should show all users with names (no null values)

---

### **Step 2: Deploy to Railway**

Once all existing users have names, the updated service will deploy successfully.

**Railway will automatically redeploy** when you push to GitHub (if you have GitHub integration enabled).

**Or manually trigger a redeploy** in Railway dashboard.

---

### **Step 3: Verify Deployment**

Test that the changes are live:

```bash
# Check a user to see the name field
curl -s "https://saas-itsidentity-svc-production.up.railway.app/v1/users" \
  -H "Authorization: Bearer test" | jq '.users[0]'
```

✅ **Success**: All users should have `"name"` with a value (not null)

---

## 🎯 What Changed

### **Backend Changes:**
1. **Prisma Schema**: `name String?` → `name String` (non-nullable)
2. **DTOs**: `name` is now required in `RegisterDto` and `CreateUserDto`
3. **Validation**: Added `@MinLength(1)` to ensure name is not empty
4. **MultiSchema Support**: Added `@@schema("identity")` for Neon schema isolation

### **Frontend Impact:**
- ✅ Registration forms must now include a name field
- ✅ Ticket assignment now shows user names instead of emails
- ✅ User display across the app will use names

---

## 🔧 For New Users

All new users **must** provide a name during registration:

**Example Registration Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"  // ← NOW REQUIRED
}
```

---

## 💡 Benefits

1. **Better UX**: Users see "John Doe" instead of "john.doe@example.com"
2. **Ticket Assignment**: Assigned tickets show operator names clearly
3. **Professional**: Proper user identification throughout the app

---

## 🚨 Troubleshooting

### Issue: "Column 'name' cannot be null" error on deployment
- **Solution**: You didn't run Step 1 first. Run the UPDATE-USER-NAMES.sql script in Neon

### Issue: Registration fails with "name is required"
- **Solution**: Update your frontend registration forms to include a name field

### Issue: Railway build fails with Prisma validation errors
- **Solution**: Make sure you've pushed the latest changes to GitHub and Railway has pulled them

---

## ✅ Summary

After completing these steps:
1. ✅ All existing users have names
2. ✅ Identity service deployed with name requirement
3. ✅ New users must provide names during registration
4. ✅ Ticket assignments show user names

Your SaaS ITS now has proper user identification! 🎉

