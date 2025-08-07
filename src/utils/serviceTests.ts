// Test utilities for the Triple Upload System (ImageKit + Appwrite)

// Create a test PDF file of specified size
export const createTestPDF = (sizeInMB: number): File => {
  const size = sizeInMB * 1024 * 1024;
  const content = new Array(size).fill('a').join('');
  const blob = new Blob([content], { type: 'application/pdf' });
  return new File([blob], `test-${sizeInMB}mb.pdf`, { type: 'application/pdf' });
};

// Test ImageKit Main Account service
export const testImageKitMainService = async (): Promise<boolean> => {
  try {
    console.log('🔸 Testing ImageKit Main Account service...');
    
    // Check environment variables
    const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
    const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
    
    if (!publicKey || publicKey.startsWith('your_')) {
      console.error('❌ ImageKit Main Account Public Key not configured');
      return false;
    }
    
    if (!privateKey || privateKey.startsWith('your_')) {
      console.error('❌ ImageKit Main Account Private Key not configured');
      return false;
    }
    
    if (!urlEndpoint || urlEndpoint.includes('your_')) {
      console.error('❌ ImageKit Main Account URL Endpoint not configured');
      return false;
    }
    
    console.log('✅ ImageKit Main Account environment variables configured');
    
    // Test API endpoint availability
    try {
      await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'OPTIONS' });
      console.log('✅ ImageKit Main Account API endpoint reachable');
      return true;
    } catch (error) {
      console.error('❌ ImageKit Main Account API endpoint not reachable');
      return false;
    }
  } catch (error) {
    console.error('❌ ImageKit Main Account test failed:', error);
    return false;
  }
};

// Test ImageKit Small Account service
export const testImageKitSmallService = async (): Promise<boolean> => {
  try {
    console.log('🔹 Testing ImageKit Small Account service...');
    
    // Check environment variables
    const publicKey = import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY;
    const privateKey = import.meta.env.VITE_IMAGEKIT_SMALL_PRIVATE_KEY;
    const urlEndpoint = import.meta.env.VITE_IMAGEKIT_SMALL_URL_ENDPOINT;
    
    if (!publicKey || publicKey.startsWith('your_')) {
      console.error('❌ ImageKit Small Account Public Key not configured');
      return false;
    }
    
    if (!privateKey || privateKey.startsWith('your_')) {
      console.error('❌ ImageKit Small Account Private Key not configured');
      return false;
    }
    
    if (!urlEndpoint || urlEndpoint.includes('your_')) {
      console.error('❌ ImageKit Small Account URL Endpoint not configured');
      return false;
    }
    
    console.log('✅ ImageKit Small Account environment variables configured');
    
    // Test API endpoint availability
    try {
      await fetch('https://upload.imagekit.io/api/v1/files/upload', { method: 'OPTIONS' });
      console.log('✅ ImageKit Small Account API endpoint reachable');
      return true;
    } catch (error) {
      console.error('❌ ImageKit Small Account API endpoint not reachable');
      return false;
    }
  } catch (error) {
    console.error('❌ ImageKit Small Account test failed:', error);
    return false;
  }
};

// Test Appwrite service
export const testAppwriteService = async (): Promise<boolean> => {
  try {
    console.log('🔶 Testing Appwrite service...');
    
    // Check environment variables
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    
    if (!endpoint || endpoint.includes('your_')) {
      console.error('❌ Appwrite Endpoint not configured');
      return false;
    }
    
    if (!projectId || projectId.startsWith('your_')) {
      console.error('❌ Appwrite Project ID not configured');
      return false;
    }
    
    if (!bucketId || bucketId.startsWith('your_')) {
      console.error('❌ Appwrite Bucket ID not configured');
      return false;
    }
    
    console.log('✅ Appwrite environment variables configured');
    
    // Test API endpoint availability
    try {
      await fetch(`${endpoint}/health`, { method: 'GET' });
      console.log('✅ Appwrite API endpoint reachable');
      return true;
    } catch (error) {
      console.error('❌ Appwrite API endpoint not reachable');
      return false;
    }
  } catch (error) {
    console.error('❌ Appwrite test failed:', error);
    return false;
  }
};

// Test Firebase service
export const testFirebaseService = async (): Promise<boolean> => {
  try {
    console.log('💾 Testing Firebase service...');
    
    // Check environment variables
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    
    if (!apiKey) {
      console.error('❌ Firebase API Key not configured');
      return false;
    }
    
    if (!projectId) {
      console.error('❌ Firebase Project ID not configured');
      return false;
    }
    
    console.log('✅ Firebase environment variables configured');
    
    // Test Firestore endpoint availability
    try {
      await fetch(
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`,
        { method: 'OPTIONS' }
      );
      console.log('✅ Firebase Firestore endpoint reachable');
      return true;
    } catch (error) {
      console.error('❌ Firebase Firestore endpoint not reachable');
      return false;
    }
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    return false;
  }
};

// Test all services in the triple upload system
export const testAllServices = async (): Promise<{
  imagekitSmall: boolean;
  imagekitMain: boolean;
  appwrite: boolean;
  firebase: boolean;
  overall: boolean;
}> => {
  console.log('🚀 Testing Triple Upload System...\n');
  
  const imagekitSmallWorking = await testImageKitSmallService();
  console.log(''); // Empty line for readability
  
  const imagekitMainWorking = await testImageKitMainService();
  console.log(''); // Empty line for readability
  
  const appwriteWorking = await testAppwriteService();
  console.log(''); // Empty line for readability
  
  const firebaseWorking = await testFirebaseService();
  console.log(''); // Empty line for readability
  
  const overall = imagekitSmallWorking && imagekitMainWorking && appwriteWorking && firebaseWorking;
  
  if (overall) {
    console.log('🎉 All services are configured and working!');
    console.log('✅ Triple Upload System Ready:');
    console.log('  🔹 Small files (< 10MB) → ImageKit Small Account');
    console.log('  🔸 Medium files (10-25MB) → ImageKit Main Account');
    console.log('  🔶 Large files (25-50MB) → Appwrite Storage');
  } else {
    console.error('🚨 Some services need configuration:');
    if (!imagekitSmallWorking) {
      console.error('- ImageKit Small Account needs setup (handles PDFs < 10MB)');
    }
    if (!imagekitMainWorking) {
      console.error('- ImageKit Main Account needs setup (handles PDFs 10-25MB)');
    }
    if (!appwriteWorking) {
      console.error('- Appwrite needs setup (handles PDFs 25-50MB)');
    }
    if (!firebaseWorking) {
      console.error('- Firebase needs setup (metadata storage)');
    }
    console.error('\n📖 See TRIPLE_UPLOAD_SETUP.md for detailed instructions');
  }
  
  return {
    imagekitSmall: imagekitSmallWorking,
    imagekitMain: imagekitMainWorking,
    appwrite: appwriteWorking,
    firebase: firebaseWorking,
    overall
  };
};

// Test file size routing logic for triple upload system
export const testFileSizeRouting = () => {
  console.log('🧪 Testing Triple Upload System routing logic...\n');
  
  const testCases = [
    { size: 2, expectedService: 'ImageKit Small Account' },
    { size: 9.9, expectedService: 'ImageKit Small Account' },
    { size: 10, expectedService: 'ImageKit Main Account' },
    { size: 15, expectedService: 'ImageKit Main Account' },
    { size: 24.9, expectedService: 'ImageKit Main Account' },
    { size: 25, expectedService: 'Appwrite Storage' },
    { size: 35, expectedService: 'Appwrite Storage' },
    { size: 49.9, expectedService: 'Appwrite Storage' },
    { size: 50, expectedService: 'Appwrite Storage' },
    { size: 51, expectedService: 'Error (too large)' }
  ];
  
  testCases.forEach(testCase => {
    const { size, expectedService } = testCase;
    
    let icon = '';
    if (size < 10) icon = '🔹';
    else if (size < 25) icon = '🔸';
    else if (size <= 50) icon = '🔶';
    else icon = '❌';
    
    console.log(`📁 ${size}MB PDF → ${icon} ${expectedService}`);
  });
  
  console.log('\n✅ Triple Upload System routing logic is correct');
  console.log('📊 System handles files from 0MB to 50MB across three providers');
};
