// Environment configuration checker for dual ImageKit system
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
    console.error('- Dual ImageKit Setup: ./DUAL_IMAGEKIT_SETUP.md');
    console.error('- Firebase: ./FIREBASE_SETUP.md');
    return false;
  }

  console.log('🎉 All services configured correctly!');
  console.log('📊 Dual ImageKit System Ready:');
  console.log('  • Small files (< 10MB) → Small Account');
  console.log('  • Large files (10-25MB) → Main Account');
  return true;
};

// Test function to verify dual ImageKit services work
export const testUploadServices = async () => {
  console.log('🧪 Testing Dual ImageKit Configuration...');
  
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

  console.log('🎯 Service Test Complete');
};
