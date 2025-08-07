/**
 * Utility functions to handle PDF URLs from different providers
 */
export const urlFixer = {
  /**
   * Check if a URL is from ImageKit
   */
  isImageKitUrl(url: string): boolean {
    return url.includes('ik.imagekit.io');
  },

  /**
   * Check if a URL is from legacy Cloudinary (for migration purposes)
   */
  isLegacyCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com');
  },

  /**
   * Get download URL for any PDF service
   */
  getDownloadUrl(url: string, _fileName?: string): string {
    // For ImageKit and other services, return the original URL
    return url;
  },

  /**
   * Get the best available URL for viewing a PDF
   */
  getViewUrl(url: string): string {
    // For all current services, return the original URL
    return url;
  },

  /**
   * Test if a URL is accessible
   */
  async testUrlAccess(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('URL access test failed:', error);
      return false;
    }
  }
};
