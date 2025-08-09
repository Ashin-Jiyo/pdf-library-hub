import { uploadToMainAccount, uploadToSmallAccount } from './imagekitDualService';
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
    if (file.size > MEDIUM_FILE_THRESHOLD) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum limit of 25MB. Appwrite is disabled.`);
    }
    let uploadResult: TripleUploadResult;
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
    } else {
      // Medium files: ImageKit Main Account (10-25MB)
      console.log('🔸 Routing to ImageKit Main Account (10-25MB)');
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
  // (Removed: else if (fileSize < LARGE_FILE_THRESHOLD) { )
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
