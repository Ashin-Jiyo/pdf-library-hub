import React from 'react';
import type { PDFDocument } from '../../types';
import { truncateText } from '../../utils/helpers';
import { pdfService } from '../../services/pdfService';
import toast from 'react-hot-toast';

interface PDFCardProps {
  pdf: PDFDocument;
}

const PDFCard: React.FC<PDFCardProps> = ({ pdf }) => {
  const handleOpen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // For Firestore storage, we need to create a blob URL
      if (pdf.fileUrl && pdf.fileUrl.startsWith('data:')) {
        const base64Data = pdf.fileUrl.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
        
        // Increment view count
        await pdfService.incrementViewCount(pdf.id);
      } else if (pdf.pdfUrl && pdf.pdfUrl !== '#') {
        // For URL-based storage (ImageKit and external links)
        window.open(pdf.pdfUrl, '_blank');
        await pdfService.incrementViewCount(pdf.id);
      }
      toast.success('PDF opened successfully');
    } catch (error) {
      console.error('Error opening PDF:', error);
      toast.error('Failed to open PDF');
    }
  };

  return (
    <div className="brutalist-card">
      <span className="brutalist-card__title">
        {truncateText(pdf.title, 18)}
      </span>
      <p className="brutalist-card__content">
        {truncateText(pdf.description, 120)}
      </p>
      <p className="brutalist-card__author">
        by {pdf.author}
      </p>
      {pdf.tags && pdf.tags.length > 0 && (
        <div className="brutalist-card__tags">
          {pdf.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="brutalist-card__tag">
              {tag}
            </span>
          ))}
          {pdf.tags.length > 3 && (
            <span className="brutalist-card__tag brutalist-card__tag--more">
              +{pdf.tags.length - 3}
            </span>
          )}
        </div>
      )}
      <div className="brutalist-card__buttons">
        <button
          onClick={handleOpen}
          className="brutalist-card__button brutalist-card__button--open"
        >
          open
        </button>
      </div>
    </div>
  );
};

export default PDFCard;
