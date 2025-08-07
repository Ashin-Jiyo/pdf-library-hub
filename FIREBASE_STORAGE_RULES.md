# Firebase Storage Rules Setup

The upload is likely failing due to Firebase Storage security rules. You need to configure the rules in your Firebase Console.

## 1. Go to Firebase Console
Open: https://console.firebase.google.com/project/pdf-library-bps/storage

## 2. Click on "Rules" Tab

## 3. Replace the default rules with this:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read;
    }
    
    // Allow authenticated users to upload PDFs and images
    match /pdfs/{filename} {
      allow write: if request.auth != null
                   && resource == null
                   && request.resource.contentType == 'application/pdf'
                   && request.resource.size < 25 * 1024 * 1024;
    }
    
    match /thumbnails/{filename} {
      allow write: if request.auth != null
                   && resource == null
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

## 4. For Testing (Temporary - LESS SECURE)
If you want to test without authentication first, use:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: The second rule set allows anyone to upload files. Use only for testing!

## 5. Click "Publish" to save the rules

After updating the rules, try uploading again!
