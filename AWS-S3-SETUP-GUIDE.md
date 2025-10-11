# AWS S3 Setup Guide for Ticket Attachments

## 🚨 Current Status
Your ticket service is currently using **LocalStack** (local S3 mock) instead of real AWS S3. This is why attachment URLs point to `http://localstack:4566/`.

## ✅ What You Need to Do

### **Step 1: Create an S3 Bucket in AWS**

1. **Log into AWS Console**: https://console.aws.amazon.com/s3/
2. **Create a new bucket**:
   - Click "Create bucket"
   - Bucket name: `saas-its-ticket-attachments` (or your preferred name)
   - Region: `us-east-1` (or your preferred region)
   - **Block all public access**: ✅ Enable (we'll use presigned URLs)
   - Click "Create bucket"

### **Step 2: Create IAM User with S3 Access**

1. **Go to IAM Console**: https://console.aws.amazon.com/iam/
2. **Create a new user**:
   - Click "Users" → "Create user"
   - Username: `saas-its-backend`
   - Click "Next"
3. **Set permissions**:
   - Select "Attach policies directly"
   - Search and select: **`AmazonS3FullAccess`** (or create a custom policy with only your bucket)
   - Click "Next" → "Create user"
4. **Create Access Keys**:
   - Click on the newly created user
   - Go to "Security credentials" tab
   - Click "Create access key"
   - Select "Application running outside AWS"
   - Click "Next" → "Create access key"
   - **⚠️ SAVE THESE CREDENTIALS (you won't see them again)**:
     - `Access key ID`: e.g., `AKIAIOSFODNN7EXAMPLE`
     - `Secret access key`: e.g., `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

### **Step 3: Configure Railway Environment Variables**

Go to your **Railway ticket-svc service** and add these environment variables:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=<your-access-key-id-from-step-2>
AWS_SECRET_ACCESS_KEY=<your-secret-access-key-from-step-2>
AWS_REGION=us-east-1
S3_BUCKET_NAME=saas-its-ticket-attachments

# Make sure NODE_ENV is set to production (this disables LocalStack)
NODE_ENV=production
```

**To add these in Railway:**
1. Open your Railway project
2. Select the `ticket-svc` service
3. Go to "Variables" tab
4. Click "+ New Variable"
5. Add each variable above
6. Click "Deploy" to restart the service

### **Step 4: Verify S3 Integration**

After Railway redeploys, test the attachment upload URL generation:

```bash
curl -X POST "https://saas-itsticket-svc-production.up.railway.app/v1/tickets/<ticket-id>/attachments/upload-url" \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" \
  -d '{"filename": "test.txt", "contentType": "text/plain"}'
```

✅ **Success**: The URL should start with `https://saas-its-ticket-attachments.s3.amazonaws.com/` or `https://s3.us-east-1.amazonaws.com/`

❌ **Still LocalStack**: The URL still shows `http://localstack:4566/` - check that `NODE_ENV=production` is set

---

## 📋 Optional: Create a Custom IAM Policy (More Secure)

Instead of `AmazonS3FullAccess`, create a custom policy with least privilege:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::saas-its-ticket-attachments",
        "arn:aws:s3:::saas-its-ticket-attachments/*"
      ]
    }
  ]
}
```

---

## 🔧 Testing After Setup

Once configured, test the full flow:

1. **Create a ticket** with an attachment in your frontend
2. **Check the backend response** - it should include attachment metadata
3. **Download the attachment** - the download URL should work
4. **Verify in AWS Console** - go to your S3 bucket and check that files are being uploaded to `tickets/<ticket-id>/<attachment-id>/`

---

## 💰 Cost Estimate

- **S3 Storage**: ~$0.023 per GB/month
- **S3 Requests**: ~$0.005 per 1,000 PUT requests
- **Data Transfer**: First 1GB free per month, then ~$0.09 per GB

For a typical SaaS with moderate attachment usage (~10GB storage, 10k uploads/month):
- **Estimated cost**: ~$0.50 - $2.00 per month

---

## 🚨 Troubleshooting

### Issue: "Access Denied" errors
- **Solution**: Check IAM user has correct S3 permissions
- Verify bucket name matches the `S3_BUCKET_NAME` env var

### Issue: "Bucket does not exist"
- **Solution**: Make sure you created the bucket in the same region as `AWS_REGION`

### Issue: Still seeing LocalStack URLs
- **Solution**: Set `NODE_ENV=production` in Railway
- Redeploy the service

---

## ✅ Summary

After completing these steps:
1. ✅ S3 bucket created
2. ✅ IAM user with S3 access created
3. ✅ Railway environment variables configured
4. ✅ Service redeployed
5. ✅ Attachment uploads working with real AWS S3

Your ticket attachments will now be stored securely in AWS S3 with presigned URLs for upload and download! 🎉

