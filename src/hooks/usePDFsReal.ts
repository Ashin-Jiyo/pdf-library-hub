import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfService } from '../services';
import type { PDFDocument } from '../types';
import { toast } from 'react-hot-toast';

// Get all PDFs
export const usePDFs = () => {
  return useQuery({
    queryKey: ['pdfs'],
    queryFn: async (): Promise<PDFDocument[]> => {
      try {
        return await pdfService.getAllPDFs();
      } catch {
        // Fallback to mock data if Firebase is not set up
        console.warn('Firebase not configured, using mock data');
        const mockPDFs: PDFDocument[] = [
          {
            id: '1',
            title: 'Getting Started with React',
            author: 'John Smith',
            description: 'A comprehensive guide to building modern web applications with React',
            categories: ['Programming', 'Web Development'],
            tags: ['React', 'JavaScript', 'Frontend'],
            pdfUrl: '#',
            previewImageUrl: 'https://via.placeholder.com/300x400',
            viewCount: 1250,
            downloadCount: 890,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            uploadedBy: 'admin1',
          },
          {
            id: '2',
            title: 'TypeScript Best Practices',
            author: 'Jane Doe',
            description: 'Learn how to write better TypeScript code with industry best practices',
            categories: ['Programming'],
            tags: ['TypeScript', 'JavaScript', 'Best Practices'],
            pdfUrl: '#',
            previewImageUrl: 'https://via.placeholder.com/300x400',
            viewCount: 920,
            downloadCount: 650,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10'),
            uploadedBy: 'admin1',
          },
          {
            id: '3',
            title: 'Database Design Fundamentals',
            author: 'Mike Johnson',
            description: 'Essential concepts for designing efficient and scalable databases',
            categories: ['Database', 'Backend'],
            tags: ['SQL', 'Database Design', 'Backend'],
            pdfUrl: '#',
            previewImageUrl: 'https://via.placeholder.com/300x400',
            viewCount: 750,
            downloadCount: 480,
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-05'),
            uploadedBy: 'admin2',
          },
        ];
        return mockPDFs;
      }
    },
  });
};

// Get single PDF
export const usePDF = (id: string) => {
  return useQuery({
    queryKey: ['pdf', id],
    queryFn: async (): Promise<PDFDocument | null> => {
      try {
        return await pdfService.getPDFById(id);
      } catch {
        console.warn('Firebase not configured, using mock data');
        // Fallback to mock data
        const mockPDFs: PDFDocument[] = [
          {
            id: '1',
            title: 'Getting Started with React',
            author: 'John Smith',
            description: 'A comprehensive guide to building modern web applications with React',
            categories: ['Programming', 'Web Development'],
            tags: ['React', 'JavaScript', 'Frontend'],
            pdfUrl: '#',
            previewImageUrl: 'https://via.placeholder.com/300x400',
            viewCount: 1250,
            downloadCount: 890,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
            uploadedBy: 'admin1',
          },
        ];
        return mockPDFs.find(pdf => pdf.id === id) || null;
      }
    },
    enabled: !!id,
  });
};

// Create PDF mutation with file upload
export const useCreatePDFWithFile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      pdfData
    }: { 
      file: File; 
      pdfData: Omit<PDFDocument, 'id' | 'createdAt' | 'updatedAt' | 'pdfUrl' | 'fileSize' | 'fileName'>;
    }) => {
      return await pdfService.createPDFWithFile(file, pdfData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF uploaded successfully!');
    },
    onError: (error) => {
      console.error('Error creating PDF:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload PDF');
    },
  });
};

// Create PDF mutation
export const useCreatePDF = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pdfData: Omit<PDFDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await pdfService.createPDF(pdfData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF uploaded successfully!');
    },
    onError: (error) => {
      console.error('Error creating PDF:', error);
      toast.error('Failed to upload PDF');
    },
  });
};

// Update PDF mutation
export const useUpdatePDF = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PDFDocument> }) => {
      return await pdfService.updatePDF(id, updates);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      queryClient.invalidateQueries({ queryKey: ['pdf', id] });
      toast.success('PDF updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating PDF:', error);
      toast.error('Failed to update PDF');
    },
  });
};

// Delete PDF mutation
export const useDeletePDF = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      return await pdfService.deletePDF(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdfs'] });
      toast.success('PDF deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting PDF:', error);
      toast.error('Failed to delete PDF');
    },
  });
};

// Increment view count
export const useIncrementViewCount = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await pdfService.incrementViewCount(id);
    },
    onError: (error) => {
      console.error('Error incrementing view count:', error);
    },
  });
};

// Increment download count
export const useIncrementDownloadCount = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      return await pdfService.incrementDownloadCount(id);
    },
    onError: (error) => {
      console.error('Error incrementing download count:', error);
    },
  });
};
