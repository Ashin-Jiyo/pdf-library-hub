import { getImageKitAuthParams, getImageKitSmallAuthParams } from '../utils/imagekitAuth';

export interface ImageKitUploadResult {
  fileId: string;
  url: string;
  size: number;
  name: string;
  filePath: string;
  provider: 'imagekit-large' | 'imagekit-small';
}

export const imagekitDualService = {
  // Smart upload function that routes to appropriate ImageKit account
  async uploadPDF(file: File): Promise<ImageKitUploadResult> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size
      if (file.size > 25 * 1024 * 1024) {
        throw new Error('File must be less than 25MB');
      }

      if (file.size === 0) {
        throw new Error('File appears to be empty');
      }

      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      console.log(`Uploading to ImageKit: ${file.name} (${fileSizeMB}MB)`);

      // Route based on file size
      if (file.size < 10 * 1024 * 1024) {
        // Use small files account for files < 10MB
        console.log('Using ImageKit small account for file < 10MB');
        return await this.uploadToSmallAccount(file);
      } else {
        // Use main account for files 10MB - 25MB
        console.log('Using ImageKit main account for file >= 10MB');
        return await this.uploadToMainAccount(file);
      }
    } catch (error) {
      console.error('Error in dual ImageKit upload:', error);
      throw error;
    }
  },

  // Upload to main ImageKit account (10MB-25MB files)
  async uploadToMainAccount(file: File): Promise<ImageKitUploadResult> {
    try {
      const timestamp = Date.now();
      const authParams = getImageKitAuthParams();
      
      // Sanitize filename to prevent 400 errors
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `large_${timestamp}_${sanitizedFileName}`);
      formData.append('folder', '/pdf-library/large-pdfs');
      formData.append('publicKey', authParams.publicKey);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire);
      formData.append('token', authParams.token);
      formData.append('useUniqueFileName', 'true');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ImageKit main account response error:', errorText);
        throw new Error(`ImageKit main upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('ImageKit main account upload error:', result.error);
        throw new Error(result.error.message || 'ImageKit main upload failed');
      }

      console.log('PDF uploaded successfully to ImageKit main account:', result.url);
      return {
        ...result,
        provider: 'imagekit-large'
      };
    } catch (error) {
      console.error('Error uploading to ImageKit main account:', error);
      throw error;
    }
  },

  // Upload to small files ImageKit account (< 10MB files)
  async uploadToSmallAccount(file: File): Promise<ImageKitUploadResult> {
    try {
      const timestamp = Date.now();
      const authParams = getImageKitSmallAuthParams();
      
      // Sanitize filename to prevent 400 errors
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `small_${timestamp}_${sanitizedFileName}`);
      formData.append('folder', '/pdf-library/small-pdfs');
      formData.append('publicKey', authParams.publicKey);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire);
      formData.append('token', authParams.token);
      formData.append('useUniqueFileName', 'true');

      // Use the small account's upload endpoint
      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ImageKit small account response error:', errorText);
        throw new Error(`ImageKit small upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('ImageKit small account upload error:', result.error);
        throw new Error(result.error.message || 'ImageKit small upload failed');
      }

      console.log('PDF uploaded successfully to ImageKit small account:', result.url);
      return {
        ...result,
        provider: 'imagekit-small'
      };
    } catch (error) {
      console.error('Error uploading to ImageKit small account:', error);
      throw error;
    }
  },

  // Get optimized URL for PDF viewing
  getOptimizedUrl(url: string): string {
    return url;
  },

  // Get download URL
  getDownloadUrl(url: string): string {
    return url;
  },

  // Delete PDF from appropriate ImageKit account
  async deletePDF(fileId: string, provider: 'imagekit-large' | 'imagekit-small'): Promise<void> {
    try {
      // Note: Deletion should be handled by a backend API for security reasons
      console.log(`PDF deletion should be handled by backend for security: ${fileId} (${provider})`);
    } catch (error) {
      console.error('Error deleting from ImageKit:', error);
      throw error;
    }
  },
};

// Export individual upload functions for external use
export const uploadToSmallAccount = imagekitDualService.uploadToSmallAccount;
export const uploadToMainAccount = imagekitDualService.uploadToMainAccount;

export default imagekitDualService;
