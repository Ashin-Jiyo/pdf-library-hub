// Environment configuration checker for triple upload system (ImageKit + Appwrite)
export const checkEnvironmentConfig = () => {
  const config = {
    imagekit: {
      publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
    },
    imagekitSmall: {
      publicKey: import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY,
      privateKey: import.meta.env.VITE_IMAGEKIT_SMALL_PRIVATE_KEY,
      urlEndpoint: import.meta.env.VITE_IMAGEKIT_SMALL_URL_ENDPOINT,
    },
    appwrite: {
      endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
      projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
      bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    },
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    }
  };

  const issues: string[] = [];

  // Check Main ImageKit config
  if (!config.imagekit.publicKey || config.imagekit.publicKey.startsWith('your_')) {
    issues.push('❌ ImageKit Main Account Public Key not configured');
  } else {
    console.log('✅ ImageKit Main Account Public Key configured');
  }

  if (!config.imagekit.privateKey || config.imagekit.privateKey.startsWith('your_')) {
    issues.push('❌ ImageKit Main Account Private Key not configured');
  } else {
    console.log('✅ ImageKit Main Account Private Key configured');
  }

  if (!config.imagekit.urlEndpoint || config.imagekit.urlEndpoint.includes('your_')) {
    issues.push('❌ ImageKit Main Account URL Endpoint not configured');
  } else {
    console.log('✅ ImageKit Main Account URL Endpoint configured');
  }

  // Check Small ImageKit config
  if (!config.imagekitSmall.publicKey || config.imagekitSmall.publicKey.startsWith('your_')) {
    issues.push('❌ ImageKit Small Account Public Key not configured');
  } else {
    console.log('✅ ImageKit Small Account Public Key configured');
  }

  if (!config.imagekitSmall.privateKey || config.imagekitSmall.privateKey.startsWith('your_')) {
    issues.push('❌ ImageKit Small Account Private Key not configured');
  } else {
    console.log('✅ ImageKit Small Account Private Key configured');
  }

  if (!config.imagekitSmall.urlEndpoint || config.imagekitSmall.urlEndpoint.includes('your_')) {
    issues.push('❌ ImageKit Small Account URL Endpoint not configured');
  } else {
    console.log('✅ ImageKit Small Account URL Endpoint configured');
  }

  // Check Appwrite config (optional for now)
  const appwriteConfigured = config.appwrite.projectId && !config.appwrite.projectId.startsWith('your_');
  
  if (!appwriteConfigured) {
    console.log('⚠️  Appwrite not configured (optional - for files 25-50MB)');
    console.log('   Current limit: 25MB via ImageKit');
    console.log('   To enable 50MB uploads, configure Appwrite storage');
  } else {
    if (!config.appwrite.endpoint || config.appwrite.endpoint.includes('your_')) {
      issues.push('❌ Appwrite Endpoint not configured');
    } else {
      console.log('✅ Appwrite Endpoint configured');
    }

    if (!config.appwrite.projectId || config.appwrite.projectId.startsWith('your_')) {
      issues.push('❌ Appwrite Project ID not configured');
    } else {
      console.log('✅ Appwrite Project ID configured');
    }

    if (!config.appwrite.bucketId || config.appwrite.bucketId.startsWith('your_')) {
      issues.push('❌ Appwrite Bucket ID not configured');
    } else {
      console.log('✅ Appwrite Bucket ID configured');
    }
  }

  // Check Firebase config
  if (!config.firebase.apiKey) {
    issues.push('❌ Firebase API Key not configured');
  } else {
    console.log('✅ Firebase API Key configured');
  }

  if (!config.firebase.projectId) {
    issues.push('❌ Firebase Project ID not configured');
  } else {
    console.log('✅ Firebase Project ID configured');
  }

  if (issues.length > 0) {
    console.error('🚨 Configuration Issues Found:');
    issues.forEach(issue => console.error(issue));
    console.error('\n📖 Please follow the setup guides:');
    console.error('- ImageKit Setup: ./IMAGEKIT_SETUP.md');
    console.error('- Firebase: ./FIREBASE_SETUP.md');
    console.error('- Optional - Appwrite Setup: ./APPWRITE_SETUP.md');
    return false;
  }

  console.log('🎉 Core services configured correctly!');
  const maxFileSize = appwriteConfigured ? '50MB' : '25MB';
  console.log(`📊 Smart Upload System Ready (max ${maxFileSize}):`);
  console.log('  🔹 Small files (< 10MB) → ImageKit Small Account');
  console.log('  🔸 Medium files (10-25MB) → ImageKit Main Account');
  if (appwriteConfigured) {
    console.log('  🔶 Large files (25-50MB) → Appwrite Storage');
  } else {
    console.log('  📋 For files 25-50MB: Configure Appwrite (see APPWRITE_SETUP.md)');
  }
  return true;
};

// Test function to verify triple upload services work
export const testUploadServices = async () => {
  console.log('🧪 Testing Triple Upload Configuration...');
  
  try {
    // Test ImageKit Main Account endpoint
    await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      { method: 'OPTIONS' }
    );
    console.log('✅ ImageKit Main Account endpoint reachable');
  } catch (error) {
    console.error('❌ ImageKit Main Account endpoint test failed:', error);
  }

  try {
    // Test ImageKit Small Account endpoint (same endpoint, different auth)
    await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      { method: 'OPTIONS' }
    );
    console.log('✅ ImageKit Small Account endpoint reachable');
  } catch (error) {
    console.error('❌ ImageKit Small Account endpoint test failed:', error);
  }

  // Test Appwrite endpoint
  try {
    const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
    await fetch(
      `${appwriteEndpoint}/health`,
      { method: 'GET' }
    );
    console.log('✅ Appwrite endpoint reachable');
  } catch (error) {
    console.error('❌ Appwrite endpoint test failed:', error);
  }

  // Test Firebase endpoint
  try {
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)/documents`,
      { method: 'OPTIONS' }
    );
    console.log('✅ Firebase Firestore endpoint reachable');
  } catch (error) {
    console.error('❌ Firebase Firestore endpoint test failed:', error);
  }

  console.log('🎯 Triple Upload Service Test Complete');
};
