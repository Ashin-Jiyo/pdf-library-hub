import { imagekitDualService } from './imagekitDualService';

export interface SimpleUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  url: string;
  provider: 'imagekit-small' | 'imagekit-large';
}

export const simpleUploadService = {
  // Simple, reliable upload that only uses ImageKit
  async uploadPDF(file: File): Promise<SimpleUploadResult> {
    try {
      console.log(`🚀 Starting simple upload for: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size (25MB limit for ImageKit)
      if (file.size > 25 * 1024 * 1024) {
        throw new Error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 25MB limit. Please use a smaller file or configure Appwrite for larger files.`);
      }

      if (file.size === 0) {
        throw new Error('File appears to be empty');
      }

      // Use dual ImageKit service
      const result = await imagekitDualService.uploadPDF(file);
      
      console.log(`✅ Upload successful: ${result.url}`);
      
      return {
        fileId: result.fileId,
        fileName: result.name,
        fileSize: result.size,
        url: result.url,
        provider: result.provider
      };
      
    } catch (error) {
      console.error('❌ Simple upload failed:', error);
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Check if upload service is properly configured
  isConfigured(): boolean {
    const hasMainAccount = !!(
      import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY && 
      import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
    );
    
    const hasSmallAccount = !!(
      import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY && 
      import.meta.env.VITE_IMAGEKIT_SMALL_PRIVATE_KEY
    );
    
    return hasMainAccount && hasSmallAccount;
  }
};

export default simpleUploadService;
