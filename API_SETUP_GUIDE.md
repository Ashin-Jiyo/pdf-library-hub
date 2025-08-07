# API Setup Guide - Making the Dual Upload System Work

This guide will walk you through setting up the APIs and services needed for the dual upload system.

## 🎯 What You Need to Set Up

1. **Cloudinary Account** (for PDFs < 10MB)
2. **ImageKit Account** (for PDFs 10MB-25MB) 
3. **Environment Variables Configuration**
4. **Upload Presets and Security Settings**

---

## 🔥 Cloudinary Setup (Step-by-Step)

### Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up Free"**
3. Choose **"Developer"** plan (it's free)
4. Verify your email address

### Step 2: Get Your Credentials

1. After login, go to your **Dashboard**
2. In the **Account Details** section, you'll see:
   - **Cloud Name**: `dxxxxx` (your unique identifier)
   - **API Key**: `123456789012345`
   - **API Secret**: `abcdefghijklmnopqrstuvwxyz` (keep this secure)

### Step 3: Create Upload Preset

This is **CRITICAL** for frontend uploads:

1. Go to **Settings** → **Upload** (gear icon → Upload tab)
2. Scroll down to **Upload presets**
3. Click **"Add upload preset"**
4. Configure as follows:
   ```
   Preset name: pdf_upload_unsigned
   Signing mode: Unsigned ✅ (IMPORTANT!)
   Resource type: Auto
   Folder: pdf-library/pdfs
   Access mode: Public
   ```
5. Click **"Save"**

### Step 4: Configure Environment Variables

Add to your `.env` file:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=pdf_upload_unsigned
```

**Replace `your_actual_cloud_name` with your real Cloud Name from Step 2!**

---

## 📸 ImageKit Setup (Step-by-Step)

### Step 1: Verify ImageKit Account

Your ImageKit credentials are already in `.env`:
```bash
VITE_IMAGEKIT_PUBLIC_KEY=public_1vF7O9S6tznVBCjXvWb1Z0Zsl0k=
VITE_IMAGEKIT_PRIVATE_KEY=private_CpvSBEbYcTfXzTxWG+o/BdMo55c=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pdfbps/
```

### Step 2: Verify ImageKit Dashboard

1. Go to [https://imagekit.io/dashboard](https://imagekit.io/dashboard)
2. Check if the account is active
3. Verify you have storage space available

---

## 🧪 Testing Your Setup

### Step 1: Check Configuration

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:5173/dashboard/upload`
3. Open browser console (F12 → Console)
4. Look for configuration check results

### Step 2: Test File Upload

1. Try uploading a **small PDF (< 10MB)** - should use Cloudinary
2. Try uploading a **large PDF (10MB+)** - should use ImageKit
3. Watch console logs for upload progress

### Expected Console Output:

**For small files (< 10MB):**
```
✅ All services configured correctly!
Routing file upload: small.pdf (5.23MB)
Using Cloudinary for file < 10MB
Uploading to Cloudinary: {name: "small.pdf", size: 5484567}
PDF uploaded successfully to Cloudinary: https://res.cloudinary.com/...
```

**For large files (≥ 10MB):**
```
Routing file upload: large.pdf (15.23MB)  
Using ImageKit for file >= 10MB
Uploading to ImageKit: {name: "large.pdf", size: 15966720}
PDF uploaded successfully to ImageKit: https://ik.imagekit.io/...
```

---

## 🚨 Common Issues and Solutions

### Issue 1: "Upload failed: 401 Unauthorized"
**Cause**: Wrong credentials or unsigned preset not configured

**Solution**:
1. Double-check your Cloud Name in `.env`
2. Ensure upload preset is set to "Unsigned"
3. Verify preset name matches exactly

### Issue 2: "Upload failed: 400 Bad Request"
**Cause**: Wrong resource type or invalid file

**Solution**:
1. Ensure you're uploading a PDF file
2. Check file isn't corrupted
3. Try with a smaller file first

### Issue 3: "Configuration not found" errors
**Cause**: Environment variables not loaded

**Solution**:
1. Restart your dev server: `npm run dev`
2. Check `.env` file is in project root
3. Ensure no extra spaces in variable names

### Issue 4: Upload works but file not visible
**Cause**: Wrong folder configuration

**Solution**:
1. Check Cloudinary Media Library for uploaded files
2. Verify folder path in upload preset
3. Check console for actual upload URLs

---

## 🔐 Security Notes

### For Development:
- Using unsigned upload presets is OK for development
- Files are public by default (which is what we want for PDFs)

### For Production:
Consider implementing:
- Signed uploads via backend API
- File size validation on server
- Virus scanning
- User authentication checks

---

## 💰 Free Tier Limits

### Cloudinary Free Tier:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25 credits/month

### ImageKit Free Tier:
- **Storage**: 3GB  
- **Bandwidth**: 20GB/month
- **Requests**: Unlimited

The dual system helps maximize these free tiers!

---

## 🎉 Verification Checklist

- [ ] Cloudinary account created
- [ ] Cloudinary upload preset configured as "Unsigned"
- [ ] Environment variables updated in `.env`
- [ ] Dev server restarted
- [ ] Configuration check passes (green checkmarks in console)
- [ ] Small file uploads to Cloudinary successfully
- [ ] Large file uploads to ImageKit successfully
- [ ] Files appear in respective dashboards

Once all items are checked, your dual upload system is ready! 🚀

---

## 📞 Need Help?

If you're still having issues:

1. **Check Browser Console**: Look for specific error messages
2. **Check Network Tab**: See what requests are failing
3. **Verify Credentials**: Double-check all API keys and names
4. **Test with Postman**: Try direct API calls to verify credentials

The most common issue is the Cloudinary upload preset not being set to "Unsigned" - this is required for frontend uploads!
