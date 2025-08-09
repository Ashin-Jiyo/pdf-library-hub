import React, { useState, useEffect } from 'react';
import { Upload, FileText, Link } from 'lucide-react';
import { useCreatePDFWithFile, useCreatePDF } from '../../hooks/usePDF';
import { useAuthState } from '../../hooks/useAuthState';
import { useCategories } from '../../hooks/useCategories';
import { checkEnvironmentConfig, testUploadServices } from '../../utils/configChecker';
import { testAllServices } from '../../utils/serviceTests';
import toast from 'react-hot-toast';

const UploadPDF: React.FC = () => {
  const { user } = useAuthState();
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '', // Changed from categories array to single category
    tags: [] as string[],
    pdfLink: '', // Add PDF link field
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [configChecked, setConfigChecked] = useState(false);

  const createPDFMutation = useCreatePDFWithFile();
  const createPDFFromLinkMutation = useCreatePDF();

  // Check configuration on component mount
  useEffect(() => {
    const isConfigured = checkEnvironmentConfig();
    setConfigChecked(isConfigured);
    
    // Run upload service tests
    testUploadServices();
    
    // Debug Appwrite configuration
    const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
    const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
    const appwriteBucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
    const appwriteConfigured = appwriteProjectId && 
                              appwriteProjectId !== 'your_appwrite_project_id_here' &&
                              !appwriteProjectId.includes('your_');
    
    console.log('🔧 Appwrite Configuration Check:', {
      projectId: appwriteProjectId,
      endpoint: appwriteEndpoint,
      bucketId: appwriteBucketId,
      isConfigured: appwriteConfigured,
      maxFileSize: appwriteConfigured ? '50MB' : '25MB'
    });
    
    if (!isConfigured) {
      toast.error('Upload services not configured. Check console for details.');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      
      // Enforce 25MB max file size (Appwrite removed)
      const maxSize = 25; // MB
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than 25MB`);
        return;
      }
      setSelectedFile(file);
      // Auto-populate title from filename if empty
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: file.name.replace('.pdf', '').replace(/[_-]/g, ' ')
        }));
      }
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const validatePDFLink = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Check if it's a valid URL and potentially a PDF
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pdfLink.trim()) {
      toast.error('Please provide a PDF link');
      return;
    }

    if (!validatePDFLink(formData.pdfLink)) {
      toast.error('Please provide a valid URL');
      return;
    }

    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error('Please fill in title and author');
      return;
    }

    try {
      // For link uploads, we create a PDF document without file upload
      console.log('Creating PDF from link...');
      const result = await createPDFFromLinkMutation.mutateAsync({
        title: formData.title,
        author: formData.author,
        description: formData.description,
        categories: formData.category ? [formData.category] : [],
        tags: formData.tags,
        viewCount: 0,
        downloadCount: 0,
        uploadedBy: user?.uid || 'anonymous',
        pdfUrl: formData.pdfLink, // Use the provided link as PDF URL
        uploadProvider: 'external', // Mark as external link
      });
      
      console.log('PDF created from link successfully, result:', result);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        category: '',
        tags: [],
        pdfLink: '',
      });
      setTagInput('');
      setUploadMethod('file');
      
    } catch (error) {
      console.error('Link upload failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Handle based on upload method
    if (uploadMethod === 'link') {
      return handleLinkSubmit(e);
    }
    
    // File upload validation
    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (!formData.title.trim() || !formData.author.trim()) {
      toast.error('Please fill in title and author');
      return;
    }

    try {
      // Debug information
      console.log('=== UPLOAD DEBUG ===');
      console.log('User:', user);
      console.log('File:', selectedFile);
      console.log('Form data:', formData);
      
      // Run pre-upload checks
      const configOk = checkEnvironmentConfig();
      if (!configOk) {
        toast.error('Upload configuration is incomplete. Check console for details.');
        return;
      }
      
      // Test upload services (async, no return value)
      await testUploadServices();
      
      console.log('Firebase config check:', {
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      });
      
      console.log('🚀 Starting upload process...');
      
      // Show upload progress toast
      const uploadToast = toast.loading('Uploading PDF...', {
        duration: 60000, // 1 minute timeout
      });
      
      const result = await createPDFMutation.mutateAsync({
        file: selectedFile,
        pdfData: {
          title: formData.title,
          author: formData.author,
          description: formData.description,
          categories: formData.category ? [formData.category] : [],
          tags: formData.tags,
          viewCount: 0,
          downloadCount: 0,
          uploadedBy: user?.uid || 'anonymous',
        }
      });
      
      toast.dismiss(uploadToast);
      console.log('✅ Upload successful, result:', result);
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        description: '',
        category: '',
        tags: [],
        pdfLink: '',
      });
      setSelectedFile(null);
      setTagInput('');
      setUploadMethod('file');

      // Reset file input
      const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('❌ Upload failed:', error);
      // Provide specific error message
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error('Upload failed: Unknown error occurred');
      }
    }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload New PDF</h1>
        <p className="text-gray-600 mt-2">
          Add a new PDF document to your library by uploading a file or providing a link
        </p>
      </div>

      {/* Configuration Warning */}
      {!configChecked && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Smart Upload System Configuration Required
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please configure ImageKit accounts before uploading files. Check the browser console for specific issues.</p>
                <p className="mt-1">
                  <a href="/IMAGEKIT_SETUP.md" className="underline">ImageKit Setup Guide</a> | 
                  <a href="/APPWRITE_SETUP.md" className="underline ml-1">Appwrite Setup (Optional)</a>
                </p>
                <button
                  onClick={async () => {
                    console.log('🧪 Testing Firebase upload configuration...');
                    const results = await testAllServices();
                    if (results.overall) {
                      toast.success('Firebase configuration verified! Upload should work.');
                      setConfigChecked(true);
                    } else {
                      toast.error('Firebase configuration issues found. Check console.');
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                >
                  Test Firebase Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Upload Method Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload Method *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="file"
                  checked={uploadMethod === 'file'}
                  onChange={(e) => setUploadMethod(e.target.value as 'file' | 'link')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Upload File</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="uploadMethod"
                  value="link"
                  checked={uploadMethod === 'link'}
                  onChange={(e) => setUploadMethod(e.target.value as 'file' | 'link')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Paste Link</span>
              </label>
            </div>
          </div>

          {/* PDF Upload or Link Input */}
          {uploadMethod === 'file' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File *
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDrop={e => {
                  e.preventDefault();
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    const file = files[0];
                    if (file.type !== 'application/pdf') {
                      toast.error('Please select a PDF file');
                      return;
                    }
                    if (file.size > 25 * 1024 * 1024) {
                      toast.error('File size must be less than 25MB');
                      return;
                    }
                    setSelectedFile(file);
                    if (!formData.title) {
                      setFormData(prev => ({ ...prev, title: file.name.replace('.pdf', '').replace(/[_-]/g, ' ') }));
                    }
                  }
                }}
                onDragOver={e => e.preventDefault()}
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500 text-sm">Maximum file size: 25MB</p>
                {selectedFile && (
                  <div className="mt-2">
                    <p className="text-gray-700 font-semibold">{selectedFile.name}</p>
                    <p className="text-gray-500 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
                <input
                  id="pdf-upload"
                  name="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                  onInput={e => {
                    const input = e.target as HTMLInputElement;
                    if (input.files && input.files[0] && input.files[0].size > 25 * 1024 * 1024) {
                      toast.error('File size must be less than 25MB');
                      input.value = '';
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="pdfLink" className="block text-sm font-medium text-gray-700 mb-2">
                PDF Link *
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  id="pdfLink"
                  name="pdfLink"
                  value={formData.pdfLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, pdfLink: e.target.value }))}
                  placeholder="https://example.com/document.pdf"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={uploadMethod === 'link'}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Paste a direct link to a PDF file hosted elsewhere
              </p>
              {formData.pdfLink && (
                <p className="mt-2 text-sm text-green-600">
                  🔗 External PDF link provided
                </p>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title * (max 18 characters)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter PDF title"
                maxLength={18}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="file"
                id="pdf-upload"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                onInput={e => {
                  const input = e.target as HTMLInputElement;
                  if (input.files && input.files[0] && input.files[0].size > 25 * 1024 * 1024) {
                    toast.error('File size must be less than 25MB');
                    input.value = '';
                  }
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/18 characters
              </p>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter a description for this PDF"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={categoriesLoading}
              >
                <option value="">
                  {categoriesLoading 
                    ? 'Loading categories...' 
                    : categoriesError 
                    ? 'Error loading categories' 
                    : 'Select a category'
                  }
                </option>
                {!categoriesLoading && !categoriesError && categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                      >
                        <span className="sr-only">Remove tag</span>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                // Reset form
                setFormData({
                  title: '',
                  author: '',
                  description: '',
                  category: '',
                  tags: [],
                  pdfLink: '',
                });
                setSelectedFile(null);
                setTagInput('');
                setUploadMethod('file');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                (createPDFMutation.isPending || createPDFFromLinkMutation.isPending) ||
                !formData.title.trim() || 
                !formData.author.trim() ||
                (uploadMethod === 'file' && !selectedFile) ||
                (uploadMethod === 'link' && !formData.pdfLink.trim())
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="mr-2 h-4 w-4" />
              {(createPDFMutation.isPending || createPDFFromLinkMutation.isPending) ? 
                (uploadMethod === 'file' ? 'Uploading...' : 'Adding Link...') : 
                (uploadMethod === 'file' ? 'Upload PDF' : 'Add PDF Link')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPDF;
