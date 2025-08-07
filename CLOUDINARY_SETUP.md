# Cloudinary Setup Guide

This guide will help you set up Cloudinary for uploading PDFs less than 10MB.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management solution. In this project, we use it for storing PDF files smaller than 10MB, while ImageKit handles larger files (10MB-25MB).

## Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB per month
- **Credits**: 25 units per month
- **Transformations**: Unlimited basic transformations

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Credentials

1. After logging in, go to your Dashboard
2. You'll see your credentials in the "Account Details" section:
   - **Cloud Name**: This is your unique identifier
   - **API Key**: Your public API key
   - **API Secret**: Your private API secret (keep this secure)

### 3. Create an Upload Preset

Upload presets allow unsigned uploads from the frontend:

1. In your Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `pdf_upload`)
   - **Signing Mode**: Select **Unsigned** (important for frontend uploads)
   - **Folder**: Set to `pdf-library/pdfs` (optional but recommended)
   - **Resource Type**: Set to **Raw** (important for PDF files)
   - **Access Mode**: Set to **Public**
5. Click **Save**

### 4. Update Environment Variables

Add these variables to your `.env` file:

```bash
# Cloudinary Configuration (for PDFs < 10MB)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name
```

Replace:
- `your_cloud_name_here` with your actual Cloud Name
- `your_upload_preset_name` with the preset name you created

### 5. Test the Setup

1. Start your development server: `npm run dev`
2. Try uploading a PDF file less than 10MB
3. Check the browser console for upload progress
4. Verify the file appears in your Cloudinary Media Library

## File Size Routing

The system automatically routes files based on size:

- **< 10MB**: Uploaded to Cloudinary
- **10MB - 25MB**: Uploaded to ImageKit
- **> 25MB**: Rejected with error message

## Security Notes

- The upload preset is set to "unsigned" for simplicity
- For production, consider implementing signed uploads via a backend
- Monitor your usage in the Cloudinary dashboard
- Set up usage alerts to avoid unexpected charges

## Troubleshooting

### Common Issues

1. **"Upload failed" error**:
   - Check your Cloud Name and Upload Preset name
   - Ensure the preset is set to "Unsigned"
   - Verify the preset allows "Raw" resource type

2. **"Invalid preset" error**:
   - Double-check the preset name in your .env file
   - Ensure the preset exists and is active

3. **"File too large" error**:
   - Cloudinary handles files < 10MB
   - Larger files automatically use ImageKit
   - Ensure your preset doesn't have size restrictions

### Debug Information

The browser console will show:
- Which service is being used for upload
- Upload progress and results
- Any error messages

## Production Considerations

1. **Security**: Implement signed uploads via backend
2. **Monitoring**: Set up usage alerts
3. **Backup**: Consider backing up important files
4. **CDN**: Cloudinary provides global CDN automatically
5. **Optimization**: Use Cloudinary's transformation features for thumbnails

## Cost Management

- Monitor usage in your Cloudinary dashboard
- Set up billing alerts
- Consider upgrading if you exceed free tier limits
- Optimize file sizes before upload when possible

## Alternative Configuration

If you prefer to use only ImageKit or only Cloudinary, you can modify the file size routing in:
`src/services/pdfUploadService.ts`

Change the `CLOUDINARY_MAX_SIZE` constant to adjust the threshold.
