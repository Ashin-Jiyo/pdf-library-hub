// Debug utility to check environment variables
export const debugConfig = () => {
  console.log('🔍 Environment Configuration Check:');
  
  // ImageKit Main Account
  console.log('ImageKit Main Account:');
  console.log('- Public Key:', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
  console.log('- Private Key:', import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('- URL Endpoint:', import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ? '✅ Set' : '❌ Missing');
  
  // ImageKit Small Account
  console.log('ImageKit Small Account:');
  console.log('- Public Key:', import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY ? '✅ Set' : '❌ Missing');
  console.log('- Private Key:', import.meta.env.VITE_IMAGEKIT_SMALL_PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log('- URL Endpoint:', import.meta.env.VITE_IMAGEKIT_SMALL_URL_ENDPOINT ? '✅ Set' : '❌ Missing');
  
  // Appwrite
  console.log('Appwrite:');
  console.log('- Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT ? '✅ Set' : '❌ Missing');
  console.log('- Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID ? '✅ Set' : '❌ Missing');
  console.log('- Bucket ID:', import.meta.env.VITE_APPWRITE_BUCKET_ID ? '✅ Set' : '❌ Missing');
  
  // Check for placeholder values
  if (import.meta.env.VITE_APPWRITE_PROJECT_ID?.includes('your_') || 
      import.meta.env.VITE_APPWRITE_PROJECT_ID === 'pdf-library-hub') {
    console.warn('⚠️ Appwrite Project ID appears to be a placeholder');
  }
  
  if (import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY?.includes('your_')) {
    console.warn('⚠️ ImageKit keys appear to be placeholders');
  }
};
