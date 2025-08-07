# ImageKit.io Upload Integration - Setup for Large PDFs (10MB-25MB)

## ✅ **Updated Integration:**

### **1. Dual Upload System**
- ✅ **ImageKit now handles PDFs 10MB-25MB** 
- ✅ **Cloudinary handles PDFs < 10MB** for cost optimization
- ✅ **Automatic routing** based on file size
- ✅ **Unified interface** through pdfUploadService

### **2. Enhanced Upload Functionality**
- ✅ **PDF Upload** to `/pdf-library/pdfs/` folder
- ✅ **Thumbnail Upload** to `/pdf-library/thumbnails/` folder (optional)
- ✅ **Better error handling** with specific ImageKit error messages
- ✅ **Debug logging** to help troubleshoot issues

### **3. File Validation**
- ✅ **PDF files only** - validates MIME type
- ✅ **10MB minimum** for ImageKit routing
- ✅ **25MB maximum** overall limit
- ✅ **Smart service selection** based on file size

## 🔧 **ImageKit Configuration Check:**

### **1. Verify Your ImageKit Credentials**
Your `.env` file has:
```
VITE_IMAGEKIT_PUBLIC_KEY=public_1vF7O9S6tznVBCjXvWb1Z0Zsl0k=
VITE_IMAGEKIT_PRIVATE_KEY=private_CpvSBEbYcTfXzTxWG+o/BdMo55c=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/pdfbps/
```

### **2. Check ImageKit Dashboard**
Go to: https://imagekit.io/dashboard
- ✅ Verify your account is active
- ✅ Check you have storage space available
- ✅ Ensure API keys match your `.env` file

### **3. Test Upload Process**
1. **Open:** http://localhost:5173/dashboard/upload
2. **Open browser console** (F12 → Console)
3. **Try uploading a PDF >= 10MB** (ImageKit handles larger files)
4. **Watch console logs** for detailed debugging

**Note:** Files < 10MB will automatically use Cloudinary instead of ImageKit.

## 📏 **File Size Routing:**

The system automatically chooses the best service:

- **PDFs < 10MB**: Uploaded to Cloudinary (faster, more cost-effective)
- **PDFs 10MB-25MB**: Uploaded to ImageKit (specialized for larger files)
- **PDFs > 25MB**: Rejected with error message

You'll see a message in the upload form indicating which service will be used.

## 📋 **Expected Console Output (for files >= 10MB):**
```
=== UPLOAD DEBUG ===
User: {uid: "...", email: "..."}
File: File {...}
Form data: {...}
Firebase config check: {...}
Starting upload process...
Routing file upload: example.pdf (15.23MB)
Using ImageKit for file >= 10MB
Starting ImageKit upload process...
File details: {name: "example.pdf", size: 15966720, type: "application/pdf"}
Uploading to ImageKit: {name: "example.pdf", size: 15966720}
PDF uploaded successfully to ImageKit: https://ik.imagekit.io/pdfbps/...
Creating Firestore document...
PDF uploaded successfully via imagekit with ID: ...
```

**For files < 10MB, you'll see:**
```
Routing file upload: small.pdf (5.23MB)
Using Cloudinary for file < 10MB
PDF uploaded successfully to Cloudinary: https://res.cloudinary.com/...
```

## 🚀 **Current Features:**

### **Upload Tab:**
- ✅ **PDF file selection** with drag & drop
- ✅ **Thumbnail image** selection (optional)
- ✅ **Form fields:** Title, Author, Description, Category, Tags
- ✅ **Real-time validation** and feedback
- ✅ **ImageKit upload** with proper authentication
- ✅ **Firestore integration** for metadata storage

### **Security Features:**
- ✅ **Signature-based auth** - Prevents unauthorized uploads
- ✅ **Expire tokens** - Auth tokens expire after 40 minutes
- ✅ **File type validation** - Only allows PDFs and images
- ✅ **Size limits** - 25MB for PDFs, 5MB for images

## 🔍 **Troubleshooting:**

### **If Upload Still Fails:**
1. **Check console errors** - Look for specific error messages
2. **Verify ImageKit quota** - Ensure you haven't exceeded limits
3. **Test with small file** - Try a small PDF first
4. **Check network** - Ensure stable internet connection

### **Common Error Messages:**
- `"Upload failed: 401"` → Check API keys in `.env`
- `"Upload failed: 413"` → File too large
- `"Upload failed: 429"` → Rate limit exceeded
- `"Invalid signature"` → Clock sync issue or wrong private key

## 📊 **File Organization in ImageKit:**
```
Your ImageKit Media Library:
├── pdf-library/
│   ├── pdfs/
│   │   ├── 1706123456789_document1.pdf
│   │   └── 1706123456790_document2.pdf
│   └── thumbnails/
│       ├── 1706123456789_preview_thumb1.jpg
│       └── 1706123456790_preview_thumb2.png
```

## 🎯 **Next Steps:**
1. **Test the upload** with a small PDF
2. **Check ImageKit dashboard** to see uploaded files
3. **Verify PDFs appear** in your dashboard's PDF tab
4. **Test download functionality** 

The ImageKit integration should now work properly with secure authentication!
