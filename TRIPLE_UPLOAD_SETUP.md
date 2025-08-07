# Triple Upload System Setup Guide

This guide will help you set up a three-tier file upload system that intelligently routes PDFs based on file size across multiple storage providers.

## System Overview

Your PDF Library Hub now uses an intelligent **Triple Upload System**:

```
🔹 Small Files (< 10MB)     → ImageKit Small Account
🔸 Medium Files (10-25MB)   → ImageKit Main Account  
🔶 Large Files (25-50MB)    → Appwrite Storage
❌ Oversized (> 50MB)       → Rejected
```

## Why This Architecture?

### **Smart Cost Optimization**
- **ImageKit Small Account**: Handle most uploads (typically < 10MB) without using main quota
- **ImageKit Main Account**: Medium files use your primary plan efficiently
- **Appwrite**: Large files get dedicated storage with 50MB support

### **Performance Benefits**
- **Load Distribution**: No single service gets overwhelmed
- **Regional Optimization**: Each service can be optimized for different use cases
- **Quota Management**: Intelligent routing prevents quota exhaustion

### **Reliability & Scalability**
- **Failover Ready**: If one service fails, others continue working
- **Easy Scaling**: Add more providers or increase limits as needed
- **Provider Diversity**: Reduces vendor lock-in risk

## Required Environment Variables

Add all these to your `.env` file:

```bash
# ImageKit Main Account (for 10-25MB files)
VITE_IMAGEKIT_PUBLIC_KEY=public_your_main_imagekit_public_key_here
VITE_IMAGEKIT_PRIVATE_KEY=private_your_main_imagekit_private_key_here
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_main_id_here

# ImageKit Small Account (for files < 10MB)  
VITE_IMAGEKIT_SMALL_PUBLIC_KEY=public_your_small_imagekit_public_key_here
VITE_IMAGEKIT_SMALL_PRIVATE_KEY=private_your_small_imagekit_private_key_here
VITE_IMAGEKIT_SMALL_URL_ENDPOINT=https://ik.imagekit.io/your_small_id_here

# Appwrite Configuration (for 25-50MB files)
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_BUCKET_ID=pdfs

# Firebase (for metadata storage)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# ... other Firebase vars
```

## Setup Steps

### 1. ImageKit Accounts Setup
Follow the existing guides:
- `./IMAGEKIT_SETUP.md` - Main account setup
- `./DUAL_UPLOAD_SYSTEM.md` - Dual ImageKit configuration

### 2. Appwrite Setup  
Follow the comprehensive guide:
- `./APPWRITE_SETUP.md` - Complete Appwrite configuration

### 3. Firebase Setup
Follow the existing guide:
- `./FIREBASE_SETUP.md` - Metadata storage setup

## Configuration Validation

After setting up all services, restart your development server:

```bash
npm run dev
```

Check the browser console for validation messages:

### ✅ Success Messages
```
🎉 All services configured correctly!
📊 Triple Upload System Ready:
  🔹 Small files (< 10MB) → ImageKit Small Account
  🔸 Medium files (10-25MB) → ImageKit Main Account
  🔶 Large files (25-50MB) → Appwrite Storage
```

### ❌ Error Messages
If you see configuration errors, verify:
- All environment variables are set correctly
- No typos in variable names
- Values don't contain placeholder text like `your_key_here`
- Development server was restarted after changes

## Testing the System

### 1. Small File Test (< 10MB)
1. Find or create a PDF under 10MB
2. Upload through admin dashboard
3. Check console for routing message:
   ```
   📊 File Analysis: small.pdf (2.5MB)
   🔹 Routing to ImageKit Small Account (< 10MB)
   ✅ Upload successful via imagekit-small
   ```

### 2. Medium File Test (10-25MB)
1. Find or create a PDF between 10-25MB
2. Upload through admin dashboard  
3. Check console for routing message:
   ```
   📊 File Analysis: medium.pdf (15.2MB)
   🔸 Routing to ImageKit Main Account (10-25MB)
   ✅ Upload successful via imagekit-large
   ```

### 3. Large File Test (25-50MB)
1. Find or create a PDF between 25-50MB
2. Upload through admin dashboard
3. Check console for routing message:
   ```
   📊 File Analysis: large.pdf (35.8MB)
   🔶 Routing to Appwrite (25-50MB)
   ✅ Upload successful via appwrite
   ```

### 4. Oversized File Test (> 50MB)
1. Try uploading a PDF over 50MB
2. Should see rejection message:
   ```
   ❌ File size (65.2MB) exceeds maximum limit of 50MB
   ```

## Monitoring & Analytics

### Upload Distribution
Monitor which services handle most uploads:
- Check Firebase console for `uploadProvider` field distribution
- Most files should route to `imagekit-small` (cost-effective)
- Medium files go to `imagekit-large` (main quota)
- Large files use `appwrite` (specialized storage)

### Performance Tracking
Watch for:
- Upload success rates per provider
- Upload speed differences
- Quota usage across services
- Error patterns

### Cost Optimization
- Monitor ImageKit quota usage in dashboard
- Track Appwrite storage consumption
- Consider file compression for borderline sizes
- Implement cleanup policies for old files

## Troubleshooting

### Upload Failures

**ImageKit Issues:**
- Check quota limits in ImageKit dashboard
- Verify API keys are not expired
- Test with smaller files first

**Appwrite Issues:**
- Confirm bucket exists and has correct permissions
- Check project ID matches configuration
- Verify file size limits in bucket settings

**Firebase Issues:**
- Ensure Firestore has proper write permissions
- Check project ID and API key validity

### Configuration Problems

**Environment Variables:**
```bash
# Check if variables are loaded
console.log(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
console.log(import.meta.env.VITE_APPWRITE_PROJECT_ID);
```

**Service Reachability:**
Use the built-in test function:
```javascript
import { testUploadServices } from './utils/configChecker';
testUploadServices();
```

### File Routing Issues

**Wrong Provider Selected:**
- Verify file size calculation is correct
- Check threshold constants in `tripleUploadService.ts`
- Ensure all providers are properly configured

## Scaling Considerations

### Adding More Providers
To add a fourth provider (e.g., AWS S3 for > 50MB):
1. Create new service file (`s3Service.ts`)
2. Update `tripleUploadService.ts` routing logic
3. Add configuration validation in `configChecker.ts`
4. Update environment variables

### Adjusting Thresholds
To change size limits:
1. Edit constants in `tripleUploadService.ts`:
   ```typescript
   const SMALL_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB
   const MEDIUM_FILE_THRESHOLD = 25 * 1024 * 1024; // 25MB
   ```
2. Update documentation and user-facing messages

### Load Balancing
For high-traffic scenarios:
- Consider multiple accounts per tier
- Implement round-robin selection
- Add health checks for provider availability

## Security Notes

1. **API Key Management**
   - Never commit real keys to version control
   - Use environment-specific configurations
   - Rotate keys regularly

2. **File Validation**
   - Validate file types and sizes on both client and server
   - Implement virus scanning where possible
   - Monitor for suspicious upload patterns

3. **Access Control**
   - Ensure proper Firebase security rules
   - Configure provider permissions correctly
   - Implement user-based upload limits

## Next Steps

1. **Monitor Performance**: Track upload success rates and speed
2. **Optimize Costs**: Monitor quota usage across all providers
3. **Plan Scaling**: Prepare for increased traffic and file sizes
4. **Implement Analytics**: Track user behavior and file popularity
5. **Add Features**: Consider file compression, thumbnails, or CDN integration

Your Triple Upload System is now ready to handle PDFs from 0-50MB with intelligent routing and cost optimization! 🚀
