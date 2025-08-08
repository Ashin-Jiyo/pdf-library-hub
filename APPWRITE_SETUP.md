# Appwrite Setup Guide

This guide will help you set up Appwrite as a backup storage solution for large PDF files (25MB-50MB).

## Why Use Appwrite?

- **Free Tier**: 2GB storage, 10GB bandwidth/month
- **Large File Support**: Up to 50MB per file
- **Easy Integration**: RESTful API
- **Backup Storage**: Automatically used for files that exceed ImageKit limits

## Setup Steps

### 1. Create an Appwrite Account

1. Go to [Appwrite Cloud](https://cloud.appwrite.io/)
2. Sign up for a free account
3. Verify your email address

### 2. Create a New Project

1. Click "Create Project"
2. Enter a project name (e.g., "PDF Library Hub")
3. Note down your **Project ID** (you'll need this later)

### 3. Create a Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click "Create Bucket"
3. Set bucket ID to: `pdfs`
4. Configure permissions:
   - **Read Access**: `any()` (allow public read)
   - **Create Access**: `any()` (allow uploads)
   - **Update Access**: `any()` (allow updates)
   - **Delete Access**: `any()` (allow deletions)

### 4. Get Your Configuration Values

1. **Endpoint**: `https://cloud.appwrite.io/v1` (standard for Appwrite Cloud)
2. **Project ID**: Found in Project Settings > General
3. **Bucket ID**: `pdfs` (the bucket you created)

### 5. Update Your Environment Variables

Add these to your `.env` file:

```bash
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_actual_project_id_here
VITE_APPWRITE_BUCKET_ID=pdfs
```

### 6. Add to GitHub Secrets (for deployment)

If you're using GitHub Pages, add these as repository secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add these secrets:
   - `VITE_APPWRITE_ENDPOINT` = `https://cloud.appwrite.io/v1`
   - `VITE_APPWRITE_PROJECT_ID` = `your_actual_project_id`
   - `VITE_APPWRITE_BUCKET_ID` = `pdfs`

## Testing the Setup

1. Start your development server: `npm run dev`
2. Try uploading a PDF file larger than 25MB
3. Check the browser console for Appwrite upload logs
4. If configured correctly, you should see: "✅ Appwrite upload successful"

## Troubleshooting

### "Failed to fetch" Error

- **Check Project ID**: Make sure it's the actual project ID, not a placeholder
- **Check Bucket Permissions**: Ensure the bucket allows public read/write
- **Check Network**: Some networks may block Appwrite endpoints

### "Bucket not found" Error

- **Create the bucket**: Make sure you created a bucket with ID `pdfs`
- **Check bucket ID**: Ensure `VITE_APPWRITE_BUCKET_ID=pdfs` in your .env

### Files Not Uploading

- **Check file size**: Appwrite is only used for files > 25MB
- **Check permissions**: Bucket must allow create/read/update/delete
- **Check console**: Look for detailed error messages in browser console

## File Size Strategy

- **< 10MB**: Uses ImageKit Small Account
- **10-25MB**: Uses ImageKit Main Account  
- **25-50MB**: Uses Appwrite (if configured)
- **> 50MB**: Upload rejected with error message

## Free Tier Limits

- **Storage**: 2GB total
- **Bandwidth**: 10GB/month
- **File Size**: 50MB per file
- **API Calls**: 75,000/month

For most use cases, this should be more than sufficient for backup storage of large PDF files.
