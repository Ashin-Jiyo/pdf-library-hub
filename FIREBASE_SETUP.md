# Firebase Setup Guide

## 1. Enable Firebase Services

In your Firebase Console (https://console.firebase.google.com), make sure to enable:

### Authentication
1. Go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Add authorized users:
   - admin@demo.com (for testing)
   - Your personal admin email

### Firestore Database
1. Go to **Firestore Database**
2. Create database in **test mode** (for development)
3. Set up the following collections:

#### Collections Structure:
```
pdfs/
├── {documentId}
│   ├── title: string
│   ├── author: string
│   ├── description: string
│   ├── categories: array
│   ├── tags: array
│   ├── pdfUrl: string
│   ├── previewImageUrl: string
│   ├── viewCount: number
│   ├── downloadCount: number
│   ├── uploadedBy: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp

categories/
├── {documentId}
│   ├── name: string
│   ├── description: string
│   ├── color: string
│   └── createdAt: timestamp

comments/
├── {documentId}
│   ├── pdfId: string
│   ├── userId: string (optional)
│   ├── authorName: string
│   ├── content: string
│   ├── isApproved: boolean
│   └── createdAt: timestamp

users/
├── {userId}
│   ├── email: string
│   ├── role: string (admin|root)
│   ├── displayName: string
│   ├── createdAt: timestamp
│   └── lastLogin: timestamp
```

### Storage
1. Go to **Storage**
2. Get started with default settings
3. Create the following folder structure:
   ```
   /pdfs/          # PDF files
   /previews/      # Preview images
   ```

### Security Rules

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // PDFs: Read for all, write for authenticated users
    match /pdfs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories: Read for all, write for authenticated users
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Comments: Read for all, write for all (with approval system)
    match /comments/{document} {
      allow read: if true;
      allow write: if true;
    }
    
    // Users: Read/write only for the user themselves or admin
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'root']);
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // PDFs and previews: Read for all, write for authenticated users
    match /pdfs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /previews/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 2. Seed Data (Optional)

You can add some initial data to test the application:

### Categories:
```json
{
  "name": "Programming",
  "description": "Software development and programming guides",
  "color": "#3B82F6"
}

{
  "name": "Web Development", 
  "description": "Frontend and backend web development resources",
  "color": "#10B981"
}

{
  "name": "Database",
  "description": "Database design and management guides", 
  "color": "#F59E0B"
}
```

### Test User:
Create a user in Authentication with:
- Email: admin@demo.com
- Password: admin123

Then add a user document in Firestore:
```json
{
  "email": "admin@demo.com",
  "role": "admin",
  "displayName": "Demo Admin",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLogin": "2024-01-01T00:00:00Z"
}
```

## 3. Environment Variables

Make sure your `.env` file is properly configured with your Firebase credentials.

## 4. Testing the Integration

1. Start the development server: `npm run dev`
2. Visit `http://localhost:5173`
3. Try logging in with your test credentials
4. Test the PDF browsing functionality
5. Test uploading a PDF (requires authentication)

## Next Steps

1. Upload some test PDFs through the dashboard
2. Set up Algolia for full-text search
3. Configure email notifications
4. Add more advanced features
