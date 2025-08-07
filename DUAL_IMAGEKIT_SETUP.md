# Dual ImageKit Setup Guide

This guide will help you set up two ImageKit accounts for optimal file management and quota usage.

## Why Dual ImageKit Accounts?

### Benefits:
- **Better Quota Management**: Separate quotas for small and large files
- **Performance Optimization**: Distribute load across two accounts
- **Cost Efficiency**: Free tier limits are doubled (40GB total bandwidth)
- **Better Organization**: Small files vs large files separation

### File Distribution:
- **Small Account**: Files < 10MB (documents, small PDFs)
- **Large Account**: Files 10-25MB (heavy documents, presentations)

## Setup Steps

### Step 1: Create Your Second ImageKit Account

1. **Go to [ImageKit.io](https://imagekit.io/)**
2. **Sign up with a different email** (or use Google/GitHub auth)
3. **Choose a different account ID** (e.g., if your main is `pdfbps`, use `pdfbps-small`)
4. **Verify your email**

### Step 2: Get Credentials for Both Accounts

#### Main Account (Large Files - Already Setup):
```bash
VITE_IMAGEKIT_PUBLIC_KEY=public_1vF7O9S6tznVBCjXvWb1Z0Zsl0k=
VITE_IMAGEKIT_PRIVATE_KEY=private_CpvSBEbYcTfXzTxWG+o/BdMo55c=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pdfbps/
```

#### Small Account (New Setup Needed):
1. Go to your new ImageKit dashboard
2. Navigate to **Developer** → **API Keys**
3. Copy the credentials and add to your `.env` file:

```bash
VITE_IMAGEKIT_SMALL_PUBLIC_KEY=your_new_public_key_here
VITE_IMAGEKIT_SMALL_PRIVATE_KEY=your_new_private_key_here
VITE_IMAGEKIT_SMALL_URL_ENDPOINT=https://ik.imagekit.io/your_small_account_id/
```

### Step 3: Update Environment Variables

Update your `.env` file with the new small account credentials:

```bash
# ImageKit Configuration - Primary Account (for files 10MB-25MB)
VITE_IMAGEKIT_PUBLIC_KEY=public_1vF7O9S6tznVBCjXvWb1Z0Zsl0k=
VITE_IMAGEKIT_PRIVATE_KEY=private_CpvSBEbYcTfXzTxWG+o/BdMo55c=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pdfbps/

# ImageKit Configuration - Secondary Account (for files < 10MB)
VITE_IMAGEKIT_SMALL_PUBLIC_KEY=your_small_account_public_key
VITE_IMAGEKIT_SMALL_PRIVATE_KEY=your_small_account_private_key
VITE_IMAGEKIT_SMALL_URL_ENDPOINT=https://ik.imagekit.io/your_small_account_id/
```

### Step 4: Test the Setup

1. **Restart your development server**
2. **Try uploading a small PDF** (< 10MB) - should go to small account
3. **Try uploading a large PDF** (> 10MB) - should go to main account
4. **Check both ImageKit dashboards** to confirm files are in the right accounts

## How It Works

### File Routing Logic:
```typescript
if (file.size < 10MB) {
  // Upload to small account
  // Folder: /pdf-library/small-pdfs
  // Prefix: small_timestamp_filename
} else {
  // Upload to main account  
  // Folder: /pdf-library/large-pdfs
  // Prefix: large_timestamp_filename
}
```

### Quota Distribution:
- **Small Account**: 20GB bandwidth + 20GB storage (monthly)
- **Main Account**: 20GB bandwidth + 20GB storage (monthly)
- **Total Available**: 40GB bandwidth + 40GB storage (monthly)

## Monitoring Usage

### ImageKit Dashboard:
1. **Small Account Dashboard**: Monitor usage for files < 10MB
2. **Main Account Dashboard**: Monitor usage for files 10-25MB

### Application Features:
- Upload logs show which account was used
- Database stores provider info (`imagekit-small` or `imagekit-large`)
- Health check tool can monitor both accounts

## Troubleshooting

### Common Issues:

1. **"ImageKit small account private key not found"**
   - Make sure `VITE_IMAGEKIT_SMALL_PRIVATE_KEY` is set in `.env`
   - Restart your development server

2. **Files going to wrong account**
   - Check file size detection in browser console
   - Verify the 10MB threshold logic

3. **Authentication errors**
   - Verify API keys are copied correctly
   - Check for extra spaces in environment variables

### Testing Commands:

```bash
# Check environment variables
echo $VITE_IMAGEKIT_SMALL_PUBLIC_KEY

# Restart development server
npm run dev
```

## Migration Notes

### Existing Files:
- Legacy single ImageKit files will continue to work
- New uploads will automatically use the dual system
- Database distinguishes between `imagekit`, `imagekit-small`, and `imagekit-large`

### Future Scaling:
- Can add more accounts if needed
- Easy to modify size thresholds
- Accounts can be specialized by file type or user role

## Benefits Summary

✅ **Doubled free tier limits** (40GB total vs 20GB)  
✅ **Better performance** with load distribution  
✅ **Organized file management** by size  
✅ **Easy monitoring** with separate dashboards  
✅ **Flexible scaling** for future growth  
✅ **No breaking changes** to existing functionality  

Your application now has a robust, scalable file upload system! 🚀
