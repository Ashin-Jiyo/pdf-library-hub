import { uploadToMainAccount, uploadToSmallAccount } from './imagekitDualService';
import { uploadToAppwrite, isAppwriteConfigured } from './appwriteService';
import { pdfService } from './pdfService';

export type UploadProvider = 'imagekit-small' | 'imagekit-large' | 'appwrite';

export interface TripleUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  provider: UploadProvider;
  downloadUrl?: string;
  bucketId?: string; // For Appwrite uploads
}

// File size thresholds (in bytes)
const SMALL_FILE_THRESHOLD = 10 * 1024 * 1024; // 10MB
const MEDIUM_FILE_THRESHOLD = 25 * 1024 * 1024; // 25MB
const LARGE_FILE_THRESHOLD = 50 * 1024 * 1024; // 50MB

export const uploadPDFFile = async (
  file: File,
  title: string,
  description: string,
  category: string,
  tags: string[] = [],
  author: string = 'Admin',
  uploadedBy: string = 'system'
): Promise<string> => {
  try {
    console.log(`📊 File Analysis: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    
    // Check if Appwrite is configured using the service function
    const appwriteConfigured = isAppwriteConfigured();
    
    if (file.size > LARGE_FILE_THRESHOLD && !appwriteConfigured) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds current limit of 25MB. To upload files up to 50MB, please configure Appwrite storage. See APPWRITE_SETUP.md for instructions.`);
    }
    
    if (file.size > LARGE_FILE_THRESHOLD) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 50MB`);
    }

    let uploadResult: TripleUploadResult;
    const fileName = `pdf_${Date.now()}_${file.name}`;

    // Route to appropriate service based on file size and availability
    if (file.size < SMALL_FILE_THRESHOLD) {
      // Small files: ImageKit Small Account (< 10MB)
      console.log('🔹 Routing to ImageKit Small Account (< 10MB)');
      const result = await uploadToSmallAccount(file);
      uploadResult = {
        fileId: result.fileId,
        fileName: result.name,
        fileSize: result.size,
        mimeType: result.filePath.split('.').pop() || 'pdf',
        url: result.url,
        provider: 'imagekit-small' as UploadProvider,
        downloadUrl: result.url
      };
    } else if (file.size < MEDIUM_FILE_THRESHOLD || !appwriteConfigured) {
      // Medium files: ImageKit Main Account (10-25MB, or 10-50MB if Appwrite not configured)
      const maxSize = appwriteConfigured ? 25 : 50;
      console.log(`🔸 Routing to ImageKit Main Account (10-${maxSize}MB)`);
      const result = await uploadToMainAccount(file);
      uploadResult = {
        fileId: result.fileId,
        fileName: result.name,
        fileSize: result.size,
        mimeType: result.filePath.split('.').pop() || 'pdf',
        url: result.url,
        provider: 'imagekit-large' as UploadProvider,
        downloadUrl: result.url
      };
    } else {
      // Large files: Appwrite (25-50MB) - only if configured
      console.log('🔶 Routing to Appwrite (25-50MB)');
      const appwriteResult = await uploadToAppwrite(file, fileName);
      uploadResult = {
        fileId: appwriteResult.fileId,
        fileName: appwriteResult.fileName,
        fileSize: appwriteResult.fileSize,
        mimeType: appwriteResult.mimeType,
        url: appwriteResult.url,
        provider: 'appwrite' as UploadProvider,
        downloadUrl: appwriteResult.url,
        bucketId: appwriteResult.bucketId // Store bucketId for later use
      };
    }

    console.log(`✅ Upload successful via ${uploadResult.provider}:`, uploadResult.fileName);

    // Prepare document data, omitting undefined fields for Firestore
    const documentData: any = {
      title,
      author,
      description,
      categories: [category],
      tags,
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      mimeType: uploadResult.mimeType,
      pdfUrl: uploadResult.url,
      fileUrl: uploadResult.url,
      uploadProvider: uploadResult.provider,
      viewCount: 0,
      downloadCount: 0,
      uploadedBy
    };

    // Only add imagekitFileId for ImageKit uploads
    if (uploadResult.provider.startsWith('imagekit')) {
      documentData.imagekitFileId = uploadResult.fileId;
    }

    // Add provider-specific fields
    if (uploadResult.provider === 'appwrite') {
      documentData.appwriteFileId = uploadResult.fileId;
      if (uploadResult.bucketId) {
        documentData.appwriteBucketId = uploadResult.bucketId;
      }
    }

    // Save metadata to Firestore
    const pdfId = await pdfService.createPDF(documentData);

    console.log('💾 PDF metadata saved to Firestore with ID:', pdfId);
    return pdfId;

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

export const getProviderInfo = (fileSize: number) => {
  if (fileSize < SMALL_FILE_THRESHOLD) {
    return {
      provider: 'imagekit-small' as UploadProvider,
      description: 'ImageKit Small Account (< 10MB)',
      icon: '🔹'
    };
  } else if (fileSize < MEDIUM_FILE_THRESHOLD) {
    return {
      provider: 'imagekit-large' as UploadProvider,
      description: 'ImageKit Main Account (10-25MB)',
      icon: '🔸'
    };
  } else if (fileSize < LARGE_FILE_THRESHOLD) {
    return {
      provider: 'appwrite' as UploadProvider,
      description: 'Appwrite Storage (25-50MB)',
      icon: '🔶'
    };
  } else {
    return {
      provider: null,
      description: 'File too large (> 50MB)',
      icon: '❌'
    };
  }
};

export const tripleUploadService = {
  uploadPDFFile,
  getProviderInfo
};

export default tripleUploadService;
