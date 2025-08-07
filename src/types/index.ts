export interface PDFDocument {
  id: string;
  title: string;
  author: string;
  description: string;
  categories: string[];
  tags: string[];
  pdfUrl: string; // URL for the PDF file
  fileUrl?: string; // Base64 data for Firestore storage (legacy)
  fileName?: string; // Original file name
  fileSize?: number; // File size in bytes
  mimeType?: string; // MIME type
  uploadProvider?: 'cloudinary' | 'imagekit' | 'imagekit-large' | 'imagekit-small' | 'appwrite' | 'firebase' | 'external'; // Which service was used for upload
  cloudinaryPublicId?: string; // Cloudinary public ID for management
  imagekitFileId?: string; // ImageKit file ID for deletion
  appwriteFileId?: string; // Appwrite file ID for deletion
  appwriteBucketId?: string; // Appwrite bucket ID for deletion
  previewImageUrl?: string;
  viewCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: string; // User ID
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
  lastLogin: Date;
}

export type UserRole = 'admin' | 'root';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
}

export interface EmailSubscription {
  id: string;
  email: string;
  categories: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}
