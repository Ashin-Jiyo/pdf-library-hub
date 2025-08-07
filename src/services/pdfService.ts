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
import type { PDFDocument } from '../types';

// Collection reference
const pdfsCollection = collection(db, 'pdfs');

export const pdfService = {
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


  // Upload PDF file to ImageKit
  async uploadPDFFile(): Promise<string> {
    // This is a stub for compatibility. Use createPDFWithFile instead.
    throw new Error('Direct PDF upload is not supported. Use createPDFWithFile.');
  },

  // Upload PDF to ImageKit and create Firestore doc
  async createPDFWithFile(
    file: File,
    pdfData: Omit<PDFDocument, 'id' | 'createdAt' | 'updatedAt' | 'pdfUrl' | 'fileSize' | 'fileName'>
  ): Promise<string> {
    try {
      // Import the triple upload service
      const { tripleUploadService } = await import('./tripleUploadService');
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        throw new Error('Only PDF files are allowed');
      }

      // Use the triple upload service which handles routing based on file size
      console.log('Starting Triple Upload System...');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });

      const pdfId = await tripleUploadService.uploadPDFFile(
        file,
        pdfData.title,
        pdfData.description,
        pdfData.categories[0] || 'General', // Use first category or default
        pdfData.tags,
        pdfData.author,
        pdfData.uploadedBy
      );

      return pdfId;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      // Provide more specific error messages
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Upload failed. Please try again.');
    }
  },

  // Download PDF from ImageKit
  async downloadPDF(pdf: PDFDocument): Promise<void> {
    try {
      if (!pdf.pdfUrl) throw new Error('PDF URL not available');
      
      const link = document.createElement('a');
      link.href = pdf.pdfUrl;
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

  // Create new PDF document
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

  // Delete PDF document
  async deletePDF(id: string): Promise<void> {
    try {
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
