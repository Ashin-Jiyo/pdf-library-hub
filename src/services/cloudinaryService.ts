export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  bytes: number;
  format: string;
  resource_type: string;
}

export const cloudinaryService = {
  // Helper function to extract public_id from Cloudinary URL
  extractPublicIdFromUrl(url: string): string {
    try {
      // Handle both old and new URL formats
      // Old format: https://res.cloudinary.com/cloudname/raw/upload/v1234567890/folder/file
      // New format: https://res.cloudinary.com/cloudname/raw/upload/folder/file
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex === -1) return '';
      
      // Get parts after 'upload'
      const afterUpload = urlParts.slice(uploadIndex + 1);
      
      // Remove version if present (starts with 'v' followed by numbers)
      const filteredParts = afterUpload.filter(part => !part.match(/^v\d+$/));
      
      return filteredParts.join('/');
    } catch (error) {
      console.error('Error extracting public_id from URL:', error);
      return '';
    }
  },

  // Upload PDF to Cloudinary (for files < 10MB)
  async uploadPDF(file: File): Promise<CloudinaryUploadResult> {
    try {
      // Validate file size (must be less than 10MB for Cloudinary)
      if (file.size >= 10 * 1024 * 1024) {
        throw new Error('File must be less than 10MB for Cloudinary upload');
      }

      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      console.log('Uploading to Cloudinary:', { name: file.name, size: file.size });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'pdf-library/pdfs');
      formData.append('resource_type', 'raw'); // Important for PDF files
      formData.append('access_mode', 'public'); // Ensure public access
      formData.append('public_id', `${Date.now()}_${file.name.replace(/\.[^/.]+$/, "")}`);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary response error:', errorText);
        throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.error) {
        console.error('Cloudinary upload error:', result.error);
        throw new Error(result.error.message || 'Cloudinary upload failed');
      }

      console.log('PDF uploaded successfully to Cloudinary:', result.secure_url);
      return result;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  // Get optimized URL for PDF viewing (removed fl_attachment to fix access issues)
  getOptimizedUrl(publicId: string): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  },

  // Get download URL with attachment flag for proper download behavior
  getDownloadUrl(publicId: string, fileName: string): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/raw/upload/fl_attachment:${fileName}/${publicId}`;
  },

  // Get direct view URL (for embedding in iframe or direct viewing)
  getViewUrl(publicId: string): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  },

  // Fix existing Cloudinary URLs that may have access issues
  getFixedUrl(originalUrl: string): string {
    const publicId = this.extractPublicIdFromUrl(originalUrl);
    if (!publicId) return originalUrl;
    
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  },

  // Get URL with signed access for private resources
  getSignedUrl(publicId: string): string {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    // For now, return the basic URL - signing would require backend implementation
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  },

  // Delete PDF from Cloudinary
  async deletePDF(publicId: string): Promise<void> {
    try {
      // Note: Deletion via client-side is not recommended for security reasons
      // This should be handled by a backend API or Cloud Function
      console.log('PDF deletion should be handled by backend for security:', publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw error;
    }
  },
};
