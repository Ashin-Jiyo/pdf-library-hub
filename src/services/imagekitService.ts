import { getImageKitAuthParams } from '../utils/imagekitAuth';

export interface ImageKitUploadResult {
  fileId: string;
  url: string;
  size: number;
  name: string;
  filePath: string;
}

export const imagekitService = {
  // Upload PDF to ImageKit (for all file sizes up to 25MB)
  async uploadPDF(file: File): Promise<ImageKitUploadResult> {
    try {
      // Validate file size (must be less than 25MB)
      if (file.size > 25 * 1024 * 1024) {
        throw new Error('File must be less than 25MB');
      }

      if (file.size === 0) {
        throw new Error('File appears to be empty');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      console.log('Uploading to ImageKit:', { name: file.name, size: file.size });

      // Generate timestamp and auth params
      const timestamp = Date.now();
      const authParams = getImageKitAuthParams();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${timestamp}_${file.name}`);
      formData.append('folder', '/pdf-library/pdfs');
      formData.append('publicKey', authParams.publicKey);
      formData.append('signature', authParams.signature);
      formData.append('expire', authParams.expire);
      formData.append('token', authParams.token);

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ImageKit response error:', errorText);
        throw new Error(`ImageKit upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('ImageKit upload error:', result.error);
        throw new Error(result.error.message || 'ImageKit upload failed');
      }

      console.log('PDF uploaded successfully to ImageKit:', result.url);
      return result;
    } catch (error) {
      console.error('Error uploading to ImageKit:', error);
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

  // Delete PDF from ImageKit
  async deletePDF(fileId: string): Promise<void> {
    try {
      // Note: Deletion should be handled by a backend API for security reasons
      console.log('PDF deletion should be handled by backend for security:', fileId);
    } catch (error) {
      console.error('Error deleting from ImageKit:', error);
      throw error;
    }
  },
};
