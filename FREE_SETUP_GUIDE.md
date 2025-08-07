# ImageKit.io + Firebase Setup Guide

## 🎉 Your PDF Library with ImageKit.io Storage!

Your application now uses **ImageKit.io** for file storage (much better than Firestore limits!) + Firebase for database. Here's what you need to do:

## 1. ImageKit.io Setup (FREE - Better than Firestore!)

1. Go to [ImageKit.io](https://imagekit.io/registration)
2. **Create free account** (no credit card needed)
3. **Free tier includes:**
   - ✅ **3GB storage** (vs 1MB Firestore limit!)
   - ✅ **20GB bandwidth** per month
   - ✅ **25MB file upload limit** (perfect for PDFs)
   - ✅ **Raw file delivery** (supports PDFs)
   - ✅ **CDN delivery** (fast worldwide)

4. **Get your credentials:**
   - Go to Dashboard → Developer Options
   - Copy: **Public Key**, **Private Key**, **URL Endpoint**

## 2. Firebase Console Setup (FREE)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. **Enable Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" 
   - No billing required!

4. **Enable Firestore Database:**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode"
   - Select your region
   - No billing required!

## 3. Add Your Credentials to .env

Update your `.env` file with both Firebase and ImageKit credentials:

```bash
# Firebase Config
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# ImageKit Config  
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

## 4. Create Your First Admin User

In Firebase Console → Authentication → Users:
- Click "Add user"
- Email: `admin@demo.com`
- Password: `admin123`

## 5. Test Your Application

1. **Development server should be running at:** http://localhost:5173
2. **Click "Admin Login"** in the navbar
3. **Login with:** admin@demo.com / admin123
4. **Upload your first PDF** (up to 25MB now!)

## 🚀 What Works Now:

✅ **PDF Upload & Storage** (ImageKit.io - 25MB limit vs 1MB before!)
✅ **User Authentication** (Firebase Auth - FREE) 
✅ **Search & Filtering** (client-side - FREE)
✅ **Comments System** (Firestore - FREE)
✅ **Download PDFs** (direct from ImageKit CDN - FAST!)
✅ **Admin Dashboard** (full management - FREE)
✅ **Analytics** (view/download counts - FREE)
✅ **PDF Previews** (ImageKit can generate thumbnails!)

## 📁 File Size Limits Comparison:

### Before (Firestore):
- ❌ 1MB maximum per file
- ❌ Slow downloads
- ❌ No thumbnails

### Now (ImageKit.io):
- ✅ **25MB maximum per file** (25x larger!)
- ✅ **Fast CDN delivery worldwide**
- ✅ **Automatic PDF thumbnails**
- ✅ **3GB total storage** (vs Firebase free limit)
- ✅ **20GB bandwidth/month**

## 🎯 Quick Start Checklist:

- [ ] Create ImageKit.io account (free)
- [ ] Enable Firebase Auth (Email/Password)
- [ ] Enable Firestore Database (test mode)
- [ ] Add Firebase config to `.env`
- [ ] Add ImageKit config to `.env`
- [ ] Create admin user
- [ ] Upload first PDF (up to 25MB!)
- [ ] Test search and download

## 💡 Why ImageKit.io is Better:

- **25x larger file limit** (25MB vs 1MB)
- **Dedicated file storage** (not database storage)
- **Built-in CDN** (faster downloads worldwide)
- **PDF thumbnail generation** (automatic previews)
- **Better for file management** (designed for media)
- **Still completely FREE!** (no credit card required)

## Need Help?

If you get any errors, check:
1. ImageKit credentials in `.env` file
2. Firebase credentials in `.env` file  
3. Authentication is enabled
4. Firestore is in "test mode"
5. PDF file is under 25MB

Your PDF library is now ready with professional-grade storage! 🎉
