import { Client, Storage, ID, Permission, Role } from 'appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const storage = new Storage(client);

export interface AppwriteUploadResult {
  fileId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  bucketId: string;
  url: string;
  provider: 'appwrite';
}

export const uploadToAppwrite = async (
  file: File,
  fileName: string,
  _folder: string = 'pdfs'
): Promise<AppwriteUploadResult> => {
  try {
    console.log(`📤 Uploading ${fileName} to Appwrite (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);

    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    if (!bucketId) {
      throw new Error('Appwrite bucket ID not configured');
    }

    // Upload file to Appwrite Storage with public permissions
    const response = await storage.createFile(
      bucketId,
      ID.unique(),
      file,
      [
        Permission.read(Role.any()),  // Allow anyone to read the file
      ]
    );

    // Generate public URL for the file
    const fileUrl = storage.getFileView(bucketId, response.$id);

    const result: AppwriteUploadResult = {
      fileId: response.$id,
      fileName: response.name,
      fileSize: response.sizeOriginal,
      mimeType: response.mimeType,
      bucketId: bucketId,
      url: fileUrl.toString(),
      provider: 'appwrite'
    };

    console.log('✅ Appwrite upload successful:', result.fileName);
    return result;

  } catch (error) {
    console.error('❌ Appwrite upload failed:', error);
    throw new Error(`Appwrite upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const deleteFromAppwrite = async (fileId: string): Promise<void> => {
  try {
    const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    if (!bucketId) {
      throw new Error('Appwrite bucket ID not configured');
    }

    await storage.deleteFile(bucketId, fileId);
    console.log('✅ File deleted from Appwrite:', fileId);
  } catch (error) {
    console.error('❌ Failed to delete from Appwrite:', error);
    throw error;
  }
};

export const getAppwriteFileUrl = (fileId: string): string => {
  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
  if (!bucketId) {
    throw new Error('Appwrite bucket ID not configured');
  }
  
  return storage.getFileView(bucketId, fileId).toString();
};

export const appwriteService = {
  uploadToAppwrite,
  deleteFromAppwrite,
  getAppwriteFileUrl
};

export default appwriteService;
