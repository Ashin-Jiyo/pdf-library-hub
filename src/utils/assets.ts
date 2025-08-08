/**
 * Asset utility functions for handling paths in different environments
 */

/**
 * Get the correct asset path for the current environment
 * @param path - The asset path (should start with /)
 * @returns The correct asset path for the current environment
 */
export const getAssetPath = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production (GitHub Pages), we need to add the base path
  if (import.meta.env.MODE === 'production') {
    return `/pdf-library-hub/${cleanPath}`;
  }
  
  // In development, use the path as-is
  return `/${cleanPath}`;
};

/**
 * Get the base URL for the current environment
 */
export const getBaseUrl = (): string => {
  if (import.meta.env.MODE === 'production') {
    return '/pdf-library-hub';
  }
  return '';
};