# Appwrite Setup Guide for Large Files (25-50MB)

This guide will help you set up Appwrite.io for handling large PDF uploads between 25-50MB in your triple upload system.

## Overview

Your system now uses three storage providers:
- **🔹 Small files (< 10MB)**: ImageKit Small Account  
- **🔸 Medium files (10-25MB)**: ImageKit Main Account
- **🔶 Large files (25-50MB)**: Appwrite Storage

## Step 1: Create Appwrite Account

1. Visit [Appwrite.io](https://appwrite.io)
2. Click "Get Started" or "Sign Up"
3. Create your account with email/password or OAuth
4. Choose the **Cloud** option for easier setup

## Step 2: Create a New Project

1. After logging in, click "Create Project"
2. Enter project details:
   - **Name**: `PDF Library Hub` 
   - **Project ID**: `pdf-library-hub` (or auto-generated)
3. Click "Create"
4. Copy your **Project ID** - you'll need this for environment variables

## Step 3: Create Storage Bucket

1. In your project dashboard, go to **Storage** → **Buckets**
2. Click "Create Bucket"
3. Configure the bucket:
   - **Bucket ID**: `pdfs` (or your preferred name)
   - **Name**: `PDF Documents`
   - **File Size Limit**: `52428800` (50MB in bytes)
   - **Allowed File Extensions**: `pdf`
   - **Compression**: `none` (for PDFs)
   - **Encryption**: `true` (recommended)
   - **Antivirus**: `true` (recommended)

## Step 4: Configure Permissions

1. In the bucket settings, go to **Permissions**
2. Add the following permissions:
   - **Create**: `users` (for authenticated uploads)
   - **Read**: `any` (for public access to PDFs)
   - **Update**: `users` (optional)
   - **Delete**: `users` (optional)

## Step 5: Get API Keys

1. Go to **Settings** → **API Keys**
2. Your **Endpoint** will be: `https://cloud.appwrite.io/v1`
3. Note your **Project ID** from the project overview

## Step 6: Environment Variables

Add these to your `.env` file:

```bash
# Appwrite Configuration (for files 25-50MB)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_BUCKET_ID=pdfs
```

## Step 7: Test Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Check the browser console for configuration validation
3. Look for these success messages:
   - ✅ Appwrite Endpoint configured
   - ✅ Appwrite Project ID configured  
   - ✅ Appwrite Bucket ID configured
   - ✅ Appwrite endpoint reachable

## Step 8: Test Large File Upload

1. Open your application
2. Log into admin dashboard
3. Try uploading a PDF between 25-50MB
4. Check console logs for routing confirmation:
   ```
   📊 File Analysis: filename.pdf (35.2MB)
   🔶 Routing to Appwrite (25-50MB)
   ✅ Upload successful via appwrite
   ```

## File Size Routing Logic

Your system automatically routes files based on size:

```
< 10MB     → 🔹 ImageKit Small Account (quota friendly)
10-25MB    → 🔸 ImageKit Main Account (standard quota)  
25-50MB    → 🔶 Appwrite Storage (large file support)
> 50MB     → ❌ Rejected (too large)
```

## Troubleshooting

### Configuration Issues
- Verify all environment variables are set correctly
- Restart dev server after changing `.env`
- Check browser console for validation errors

### Upload Failures
- Ensure bucket permissions allow file creation
- Check file size is within 50MB limit
- Verify file is a valid PDF
- Look for CORS issues in network tab

### Access Issues  
- Confirm bucket read permissions are set to "any"
- Test file URLs directly in browser
- Check Appwrite project status

## Cost Considerations

Appwrite Cloud pricing (as of 2024):
- **Free Tier**: 2GB storage, 10GB bandwidth
- **Pro Plan**: $15/month for 100GB storage, 500GB bandwidth
- **Scale**: Pay-as-you-go for larger usage

For large files, consider:
- Monitor your storage usage in Appwrite dashboard
- Set up alerts for quota limits
- Consider file lifecycle policies for old uploads

## Security Notes

1. **Never expose** Appwrite API keys in client-side code
2. Use server-side APIs for sensitive operations
3. Enable antivirus scanning for uploaded files
4. Consider implementing file deletion policies
5. Monitor for unusual upload patterns

## Next Steps

- Monitor upload success rates across all three providers
- Implement file cleanup for failed uploads
- Consider adding file compression for large PDFs
- Set up monitoring and alerts for quota usage
- Plan for scaling if you exceed free tier limits

Your triple upload system is now ready to handle files from 0-50MB across three optimized storage providers!
