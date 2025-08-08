import { Client, Storage, ID, Permission, Role } from 'appwrite';

// Appwrite configuration with validation
const getAppwriteConfig = () => {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;

  // Check if Appwrite is properly configured
  if (!endpoint || !projectId || !bucketId) {
    console.warn('⚠️ Appwrite not fully configured. Some environment variables are missing.');
    return null;
  }

  // Check if using placeholder values
  if (projectId.includes('your_') || projectId === 'pdf-library-hub') {
    console.warn('⚠️ Appwrite project ID appears to be a placeholder. Please configure with actual project ID.');
    return null;
  }

  return { endpoint, projectId, bucketId };
};

const config = getAppwriteConfig();

// Only initialize client if config is valid
const client = config ? new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId) : null;

const storage = client ? new Storage(client) : null;

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

    // Check if Appwrite is configured
    if (!storage || !config) {
      throw new Error('Appwrite not properly configured. Please check your environment variables.');
    }

    const bucketId = config.bucketId;

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
    if (!storage || !config) {
      throw new Error('Appwrite not properly configured. Please check your environment variables.');
    }

    const bucketId = config.bucketId;
    await storage.deleteFile(bucketId, fileId);
    console.log('✅ File deleted from Appwrite:', fileId);
  } catch (error) {
    console.error('❌ Failed to delete from Appwrite:', error);
    throw error;
  }
};

export const getAppwriteFileUrl = (fileId: string): string => {
  if (!storage || !config) {
    throw new Error('Appwrite not properly configured. Please check your environment variables.');
  }
  
  const bucketId = config.bucketId;
  return storage.getFileView(bucketId, fileId).toString();
};

export const isAppwriteConfigured = (): boolean => {
  return config !== null && storage !== null;
};

export const appwriteService = {
  uploadToAppwrite,
  deleteFromAppwrite,
  getAppwriteFileUrl,
  isAppwriteConfigured
};

export default appwriteService;
