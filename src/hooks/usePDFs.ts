import { useQuery } from '@tanstack/react-query';
import type { PDFDocument } from '../types';

// Mock data for development
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

export const usePDFs = () => {
  return useQuery({
    queryKey: ['pdfs'],
    queryFn: async (): Promise<PDFDocument[]> => {
      // TODO: Replace with actual Firebase query
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockPDFs;
    },
  });
};

export const usePDF = (id: string) => {
  return useQuery({
    queryKey: ['pdf', id],
    queryFn: async (): Promise<PDFDocument | null> => {
      // TODO: Replace with actual Firebase query
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPDFs.find(pdf => pdf.id === id) || null;
    },
    enabled: !!id,
  });
};
