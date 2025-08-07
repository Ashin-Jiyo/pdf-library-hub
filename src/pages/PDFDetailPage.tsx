import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, Calendar, User, Tag, ArrowLeft } from 'lucide-react';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';

// Hooks
import { usePDF } from '../hooks/usePDF';

// Utils
import { formatDate } from '../utils/helpers';

const PDFDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: pdf, isLoading } = usePDF(id!);

  const handleOpen = () => {
    if (pdf?.pdfUrl) {
      window.open(pdf.pdfUrl, '_blank');
      // TODO: Increment view count
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!pdf) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">PDF not found</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-500">
          ← Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 px-4 lg:px-0">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Library
      </Link>

      {/* PDF Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* PDF Info */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">{pdf.title}</h1>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-600">
                <User size={18} className="mr-2 flex-shrink-0" />
                <span>By {pdf.author}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2 flex-shrink-0" />
                <span>Published on {formatDate(new Date(pdf.createdAt))}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Eye size={18} className="mr-2 flex-shrink-0" />
                <span>{pdf.viewCount} views</span>
              </div>
            </div>

            {/* Categories and Tags */}
            {(pdf.categories.length > 0 || pdf.tags.length > 0) && (
              <div className="mb-6">
                {pdf.categories.length > 0 && (
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      {pdf.categories.map((category: string) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {pdf.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {pdf.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-center lg:justify-start">
              <button
                onClick={handleOpen}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Eye size={20} className="mr-2" />
                Open PDF
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {pdf.description && (
          <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <div
              className="prose prose-sm lg:prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: pdf.description }}
            />
          </div>
        )}
      </div>

    </div>
  );
};

export default PDFDetailPage;
