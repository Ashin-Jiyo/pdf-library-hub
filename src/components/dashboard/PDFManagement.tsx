import React, { useState } from 'react';
import { FileText, Eye, Download, Calendar, Edit, Trash2, AlertCircle } from 'lucide-react';
import { usePDFs, useDeletePDF, useUpdatePDF } from '../../hooks/usePDF';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import type { PDFDocument } from '../../types';

const PDFManagement: React.FC = () => {
  const { data: pdfs, isLoading, error } = usePDFs();
  const deletePDFMutation = useDeletePDF();
  const updatePDFMutation = useUpdatePDF();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingPDF, setEditingPDF] = useState<PDFDocument | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    tags: [] as string[],
  });

  const handleDelete = async (id: string) => {
    try {
      await deletePDFMutation.mutateAsync(id);
      setDeleteConfirm(null);
      toast.success('PDF deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete PDF');
    }
  };

  const handleEdit = (pdf: PDFDocument) => {
    setEditingPDF(pdf);
    setEditForm({
      title: pdf.title,
      author: pdf.author,
      description: pdf.description,
      category: pdf.categories[0] || '',
      tags: pdf.tags,
    });
  };

  const handleUpdatePDF = async () => {
    if (!editingPDF) return;

    try {
      await updatePDFMutation.mutateAsync({
        id: editingPDF.id,
        updates: {
          title: editForm.title,
          author: editForm.author,
          description: editForm.description,
          categories: editForm.category ? [editForm.category] : [],
          tags: editForm.tags,
        }
      });
      setEditingPDF(null);
      toast.success('PDF updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update PDF');
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !editForm.tags.includes(tag.trim())) {
      setEditForm(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Error loading PDFs</h3>
          <p className="text-gray-500">Please check your Firebase connection</p>
        </div>
      </div>
    );
  }

  const totalViews = pdfs?.reduce((sum, pdf) => sum + pdf.viewCount, 0) || 0;
  const totalDownloads = pdfs?.reduce((sum, pdf) => sum + pdf.downloadCount, 0) || 0;
  const thisMonth = pdfs?.filter(pdf => {
    const pdfDate = new Date(pdf.createdAt);
    const now = new Date();
    return pdfDate.getMonth() === now.getMonth() && pdfDate.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">PDF Management</h1>
        <Link
          to="/dashboard/upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Upload New PDF
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-sm font-medium text-gray-600">Total PDFs</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{pdfs?.length || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-green-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Download className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{totalDownloads.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-orange-600" />
            <div className="ml-3 lg:ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{thisMonth}</p>
            </div>
          </div>
        </div>
      </div>      {/* PDFs Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All PDFs ({pdfs?.length || 0})</h2>
        </div>
        {pdfs && pdfs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PDF
                  </th>
                  <th className="hidden sm:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="hidden md:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pdfs.map((pdf) => (
                  <tr key={pdf.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10">
                          <div className="h-8 w-8 lg:h-10 lg:w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-3 lg:ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {pdf.title}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500 max-w-xs truncate">
                            {pdf.categories.join(', ')}
                          </div>
                          {/* Show author on mobile when author column is hidden */}
                          <div className="sm:hidden text-xs text-gray-500 truncate mt-1">
                            by {pdf.author}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pdf.author}
                    </td>
                    <td className="hidden md:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pdf.viewCount.toLocaleString()}
                    </td>
                    <td className="hidden md:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pdf.downloadCount.toLocaleString()}
                    </td>
                    <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pdf.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <button 
                          onClick={() => handleEdit(pdf)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Edit PDF"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(pdf.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete PDF"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No PDFs uploaded yet</h3>
            <p className="text-gray-500 mb-4">Start by uploading your first PDF document</p>
            <Link
              to="/dashboard/upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Upload First PDF
            </Link>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete PDF</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this PDF? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={deletePDFMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deletePDFMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deletePDFMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit PDF Modal */}
      {editingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit PDF Details</h3>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title * (max 18 characters)
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={18}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {editForm.title.length}/18 characters
                </p>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  value={editForm.author}
                  onChange={(e) => setEditForm(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Database">Database</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Education">Education</option>
                  <option value="Research">Research</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type a tag and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addTag(input.value);
                      input.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingPDF(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={updatePDFMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdatePDF}
                disabled={updatePDFMutation.isPending || !editForm.title.trim() || !editForm.author.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {updatePDFMutation.isPending ? 'Updating...' : 'Update PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFManagement;
