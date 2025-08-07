import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { urlFixer } from './urlFixer';
import type { PDFDocument } from '../types';

/**
 * Migration utility for legacy PDF URLs and general URL health checks
 */
export class PDFUrlMigration {
  private readonly pdfsCollection = collection(db, 'pdfs');

  /**
   * Check all PDFs for URL access issues
   */
  async checkAllPdfUrls(): Promise<{
    total: number;
    accessible: number;
    inaccessible: PDFDocument[];
  }> {
    try {
      const querySnapshot = await getDocs(this.pdfsCollection);
      const pdfs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as PDFDocument));

      const results = {
        total: pdfs.length,
        accessible: 0,
        inaccessible: [] as PDFDocument[]
      };

      for (const pdf of pdfs) {
        if (pdf.pdfUrl) {
          const isAccessible = await urlFixer.testUrlAccess(pdf.pdfUrl);
          if (isAccessible) {
            results.accessible++;
          } else {
            results.inaccessible.push(pdf);
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error checking PDF URLs:', error);
      throw error;
    }
  }

  /**
   * Identify legacy Cloudinary URLs that may need attention
   */
  async findLegacyCloudinaryUrls(): Promise<PDFDocument[]> {
    try {
      const querySnapshot = await getDocs(this.pdfsCollection);
      const pdfs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      } as PDFDocument));

      return pdfs.filter(pdf => 
        urlFixer.isLegacyCloudinaryUrl(pdf.pdfUrl || '')
      );
    } catch (error) {
      console.error('Error finding legacy Cloudinary URLs:', error);
      throw error;
    }
  }

  /**
   * Generate report of PDF URL status
   */
  async generateReport(): Promise<string> {
    try {
      const checkResult = await this.checkAllPdfUrls();
      const legacyCloudinary = await this.findLegacyCloudinaryUrls();
      
      let report = `# PDF URL Status Report\n\n`;
      report += `**Total PDFs**: ${checkResult.total}\n`;
      report += `**Accessible**: ${checkResult.accessible}\n`;
      report += `**Inaccessible**: ${checkResult.inaccessible.length}\n`;
      report += `**Legacy Cloudinary URLs**: ${legacyCloudinary.length}\n\n`;

      if (legacyCloudinary.length > 0) {
        report += `## Legacy Cloudinary PDFs (May Need Manual Migration):\n\n`;
        
        for (const pdf of legacyCloudinary) {
          const isAccessible = checkResult.inaccessible.find(p => p.id === pdf.id) ? 'No' : 'Yes';
          
          report += `- **${pdf.title}**\n`;
          report += `  - URL: ${pdf.pdfUrl}\n`;
          report += `  - Accessible: ${isAccessible}\n`;
          report += `  - Created: ${pdf.createdAt.toLocaleDateString()}\n\n`;
        }
      }

      if (checkResult.inaccessible.length > 0) {
        report += `## Other Inaccessible PDFs:\n\n`;
        
        const nonCloudinary = checkResult.inaccessible.filter(pdf => 
          !urlFixer.isLegacyCloudinaryUrl(pdf.pdfUrl || '')
        );
        
        for (const pdf of nonCloudinary) {
          const service = urlFixer.isImageKitUrl(pdf.pdfUrl || '') ? 'ImageKit' : 'External/Unknown';
          
          report += `- **${pdf.title}** (${service})\n`;
          report += `  - URL: ${pdf.pdfUrl}\n`;
          report += `  - Created: ${pdf.createdAt.toLocaleDateString()}\n\n`;
        }
      }

      return report;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const pdfUrlMigration = new PDFUrlMigration();
