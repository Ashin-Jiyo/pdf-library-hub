import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { imagekitDualService } from './imagekitDualService';
import type { PDFDocument } from '../types';

// Collection reference
const pdfsCollection = collection(db, 'pdfs');

// File size constants
const getMaxFileSize = () => {
  // Check if Appwrite is configured for large files
  const appwriteConfigured = import.meta.env.VITE_APPWRITE_PROJECT_ID && 
                            !import.meta.env.VITE_APPWRITE_PROJECT_ID.includes('your_');
  return appwriteConfigured ? 50 * 1024 * 1024 : 25 * 1024 * 1024; // 50MB with Appwrite, 25MB without
};

export const pdfUploadService = {
  // Upload function that uses dual ImageKit accounts based on file size
  async uploadPDFFile(file: File): Promise<{
    url: string;
    fileId: string;
    provider: 'imagekit-large' | 'imagekit-small';
    size: number;
  }> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Validate file size
      const maxSize = getMaxFileSize();
      if (file.size > maxSize) {
        const appwriteConfigured = import.meta.env.VITE_APPWRITE_PROJECT_ID && 
                                  !import.meta.env.VITE_APPWRITE_PROJECT_ID.includes('your_');
        if (!appwriteConfigured) {
          throw new Error(`File size must be less than 25MB. To upload files up to 50MB, please configure Appwrite storage.`);
        } else {
          throw new Error(`File size must be less than 50MB`);
        }
      }

      if (file.size === 0) {
        throw new Error('File appears to be empty');
      }

      console.log(`Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

      // Use dual ImageKit service
      const result = await imagekitDualService.uploadPDF(file);
      
      return {
        url: result.url,
        fileId: result.fileId,
        provider: result.provider,
        size: result.size,
      };
    } catch (error) {
      console.error('Error in PDF upload:', error);
      throw error;
    }
  },

  // Create PDF document with smart file upload
  async createPDFWithFile(
    file: File,
    pdfData: Omit<PDFDocument, 'id' | 'createdAt' | 'updatedAt' | 'pdfUrl' | 'fileSize' | 'fileName'>
  ): Promise<string> {
    try {
      console.log('Starting smart PDF upload process...');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });

      // Upload file using smart routing
      const uploadResult = await this.uploadPDFFile(file);

      // Create Firestore document with provider-specific metadata
      console.log('Creating Firestore document...');
      const firestoreData = {
        ...pdfData,
        pdfUrl: uploadResult.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadProvider: uploadResult.provider,
        imagekitFileId: uploadResult.fileId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(pdfsCollection, firestoreData);
      
      console.log(`PDF uploaded successfully via ${uploadResult.provider} with ID:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      // Provide more specific error messages
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload failed. Please try again.');
    }
  },

  // Get optimized URL for viewing based on provider
  getOptimizedUrl(pdf: PDFDocument): string {
    if (pdf.uploadProvider === 'external') {
      // For external links, return the URL directly
      return pdf.pdfUrl;
    } else if (pdf.uploadProvider === 'imagekit' || pdf.uploadProvider === 'imagekit-large' || pdf.uploadProvider === 'imagekit-small') {
      return imagekitDualService.getOptimizedUrl(pdf.pdfUrl);
    }
    return pdf.pdfUrl;
  },

  // Get download URL based on provider
  getDownloadUrl(pdf: PDFDocument): string {
    if (pdf.uploadProvider === 'external') {
      // For external links, return the URL directly
      return pdf.pdfUrl;
    } else if (pdf.uploadProvider === 'imagekit' || pdf.uploadProvider === 'imagekit-large' || pdf.uploadProvider === 'imagekit-small') {
      return imagekitDualService.getDownloadUrl(pdf.pdfUrl);
    }
    return pdf.pdfUrl;
  },

  // Download PDF with provider-specific handling
  async downloadPDF(pdf: PDFDocument): Promise<void> {
    try {
      if (!pdf.pdfUrl) throw new Error('PDF URL not available');
      
      const downloadUrl = this.getDownloadUrl(pdf);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = pdf.fileName || `${pdf.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },

  // Get all PDFs
  async getAllPDFs(): Promise<PDFDocument[]> {
    try {
      const q = query(pdfsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as PDFDocument));
    } catch (error) {
      console.error('Error fetching PDFs:', error);
      throw error;
    }
  },

  // Get PDF by ID
  async getPDFById(id: string): Promise<PDFDocument | null> {
    try {
      const docRef = doc(db, 'pdfs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as PDFDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw error;
    }
  },

  // Create new PDF document (without file)
  async createPDF(pdfData: Omit<PDFDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(pdfsCollection, {
        ...pdfData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating PDF:', error);
      throw error;
    }
  },

  // Update PDF document
  async updatePDF(id: string, updates: Partial<PDFDocument>): Promise<void> {
    try {
      const docRef = doc(db, 'pdfs', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating PDF:', error);
      throw error;
    }
  },

  // Delete PDF document and file
  async deletePDF(id: string): Promise<void> {
    try {
      // Get PDF document first to determine provider
      const pdf = await this.getPDFById(id);
      
      if (pdf) {
        // Delete from storage provider
        if (pdf.uploadProvider === 'imagekit-large' || pdf.uploadProvider === 'imagekit-small') {
          await imagekitDualService.deletePDF(pdf.imagekitFileId!, pdf.uploadProvider);
        } else if (pdf.uploadProvider === 'imagekit' && pdf.imagekitFileId) {
          // Legacy imagekit files - use generic provider
          await imagekitDualService.deletePDF(pdf.imagekitFileId, 'imagekit-large');
        }
        // Note: For legacy Cloudinary files, deletion should be handled manually
        // or through a migration script since we're removing Cloudinary support
      }

      // Delete Firestore document
      const docRef = doc(db, 'pdfs', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  },

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'pdfs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentCount = docSnap.data().viewCount || 0;
        await updateDoc(docRef, {
          viewCount: currentCount + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  },

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'pdfs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentCount = docSnap.data().downloadCount || 0;
        await updateDoc(docRef, {
          downloadCount: currentCount + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  },

  // Search PDFs by category
  async searchByCategory(category: string): Promise<PDFDocument[]> {
    try {
      const q = query(
        pdfsCollection, 
        where('categories', 'array-contains', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as PDFDocument));
    } catch (error) {
      console.error('Error searching PDFs by category:', error);
      throw error;
    }
  },

  // Search PDFs by text
  async searchPDFs(searchTerm: string): Promise<PDFDocument[]> {
    try {
      const allPDFs = await this.getAllPDFs();
      
      const searchLower = searchTerm.toLowerCase();
      return allPDFs.filter(pdf => 
        pdf.title.toLowerCase().includes(searchLower) ||
        pdf.description.toLowerCase().includes(searchLower) ||
        pdf.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    } catch (error) {
      console.error('Error searching PDFs:', error);
      throw error;
    }
  },

  // Get PDFs by category
  async getPDFsByCategory(category: string): Promise<PDFDocument[]> {
    return this.searchByCategory(category);
  },
};
