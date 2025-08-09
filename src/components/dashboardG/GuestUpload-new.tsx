import React, { useState, useEffect } from 'react';
import { Upload, FileText, Link, Plus, X, ChevronDown } from 'lucide-react';
import { useCreatePDFWithFile, useCreatePDF } from '../../hooks/usePDF';
import { useGuestAuth } from '../../hooks/useGuestAuth';
import { useCategories } from '../../hooks/useCategories';
import { checkEnvironmentConfig } from '../../utils/configChecker';
import toast from 'react-hot-toast';

const GuestUpload: React.FC = () => {
  const { guestUser } = useGuestAuth();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    categories: [] as string[],
    tags: [] as string[],
    pdfLink: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [configChecked, setConfigChecked] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const createPDFMutation = useCreatePDFWithFile();
  const createPDFFromLinkMutation = useCreatePDF();

  // Check configuration on component mount
  useEffect(() => {
    const isConfigured = checkEnvironmentConfig();
    setConfigChecked(isConfigured);
    
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
      
      // Check if Appwrite is configured for large files
      // Enforce 25MB max file size (Appwrite removed)
      const maxSize = 25; // MB
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than 25MB`);
        return;
      }
      setSelectedFile(file);
      // Auto-populate title from filename if empty
      if (!formData.title) {
        const nameWithoutExtension = file.name.replace(/\.pdf$/i, '');
        setFormData(prev => ({ ...prev, title: nameWithoutExtension }));
      }
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleClear = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      categories: [],
      tags: [],
      pdfLink: '',
    });
    setSelectedFile(null);
    setTagInput('');
    // Reset file input
    const fileInput = document.getElementById('pdf-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!configChecked) {
      toast.error('Upload services not configured');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (uploadMethod === 'file' && !selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    if (uploadMethod === 'link' && !formData.pdfLink.trim()) {
      toast.error('Please enter a PDF link');
      return;
    }

    try {
      const pdfData = {
        title: formData.title.trim(),
        author: formData.author.trim() || guestUser?.name || 'Anonymous',
        description: formData.description.trim(),
        categories: formData.categories,
        tags: formData.tags,
        viewCount: 0,
        downloadCount: 0,
        uploadedBy: guestUser?.email || 'guest'
      };

      if (uploadMethod === 'file' && selectedFile) {
        await createPDFMutation.mutateAsync({
          pdfData,
          file: selectedFile
        });
      } else if (uploadMethod === 'link') {
        await createPDFFromLinkMutation.mutateAsync({
          ...pdfData,
          pdfUrl: formData.pdfLink.trim()
        });
      }

      toast.success('PDF uploaded successfully!');
      handleClear();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF. Please try again.');
    }
  };

  const isLoading = createPDFMutation.isPending || createPDFFromLinkMutation.isPending;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#2c3e50',
          margin: '0 0 0.5rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          📚 Upload PDF
        </h1>
        <p style={{
          color: '#7f8c8d',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Share your PDF documents with the community
        </p>
      </div>

      {/* Upload Method Selector */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        justifyContent: 'center'
      }}>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: `2px solid ${uploadMethod === 'file' ? '#3498db' : '#e0e6ed'}`,
            borderRadius: '12px',
            background: uploadMethod === 'file' ? 'rgba(52, 152, 219, 0.1)' : 'white',
            color: uploadMethod === 'file' ? '#3498db' : '#7f8c8d',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          <Upload size={20} />
          Upload File
        </button>
        
        <button
          type="button"
          onClick={() => setUploadMethod('link')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            border: `2px solid ${uploadMethod === 'link' ? '#3498db' : '#e0e6ed'}`,
            borderRadius: '12px',
            background: uploadMethod === 'link' ? 'rgba(52, 152, 219, 0.1)' : 'white',
            color: uploadMethod === 'link' ? '#3498db' : '#7f8c8d',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          <Link size={20} />
          Add Link
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* File/Link Upload Section */}
        {uploadMethod === 'file' ? (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              PDF File
            </label>
            <div style={{
              border: '2px dashed #e0e6ed',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#3498db';
              e.currentTarget.style.background = 'rgba(52, 152, 219, 0.1)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#e0e6ed';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#e0e6ed';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)';
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
                  const nameWithoutExtension = file.name.replace(/\.pdf$/i, '');
                  setFormData(prev => ({ ...prev, title: nameWithoutExtension }));
                }
              }
            }}
            onClick={() => document.getElementById('pdf-file')?.click()}
            >
              <FileText size={48} color="#3498db" style={{ marginBottom: '1rem' }} />
              {selectedFile ? (
                <div>
                  <p style={{ color: '#2c3e50', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                    {selectedFile.name}
                  </p>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#2c3e50', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                    Click to select or drag & drop your PDF
                  </p>
                  <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                    Maximum file size: 25MB
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              id="pdf-file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              style={{ display: 'none' }}
              onInput={e => {
                const input = e.target as HTMLInputElement;
                if (input.files && input.files[0] && input.files[0].size > 25 * 1024 * 1024) {
                  toast.error('File size must be less than 25MB');
                  input.value = '';
                }
              }}
            />
          </div>
        ) : (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              PDF Link
            </label>
            <input
              type="url"
              placeholder="https://example.com/document.pdf"
              value={formData.pdfLink}
              onChange={(e) => setFormData(prev => ({ ...prev, pdfLink: e.target.value }))}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: 'rgba(255, 255, 255, 0.9)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e6ed';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        )}

        {/* Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Title *
          </label>
          <input
            type="text"
            placeholder="Enter PDF title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={isLoading}
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.9)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e6ed';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Author */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Author
          </label>
          <input
            type="text"
            placeholder="Enter author name (optional)"
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.9)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e6ed';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Description
          </label>
          <textarea
            placeholder="Enter a brief description of the PDF"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            disabled={isLoading}
            rows={4}
            style={{
              width: '100%',
              padding: '1rem',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box',
              background: 'rgba(255, 255, 255, 0.9)',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498db';
              e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e0e6ed';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Categories
          </label>
          {categoriesLoading ? (
            <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Loading categories...</p>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  minHeight: '3rem'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3498db';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e6ed';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  flex: 1
                }}>
                  {formData.categories.length > 0 ? (
                    formData.categories.map((categoryId) => {
                      const category = categories.find(cat => cat.id === categoryId);
                      return category ? (
                        <span
                          key={categoryId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '15px',
                            background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
                            color: 'white',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}
                        >
                          {category.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryChange(categoryId);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              padding: '0',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ) : null;
                    })
                  ) : (
                    <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>
                      Select categories...
                    </span>
                  )}
                </div>
                <ChevronDown 
                  size={20} 
                  style={{ 
                    color: '#7f8c8d',
                    transform: categoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} 
                />
              </div>
              
              {categoryDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid #e0e6ed',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {categories.length > 0 ? categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => {
                        handleCategoryChange(category.id);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderBottom: '1px solid rgba(224, 230, 237, 0.5)',
                        transition: 'all 0.3s ease',
                        background: formData.categories.includes(category.id) 
                          ? 'rgba(52, 152, 219, 0.1)' 
                          : 'transparent'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = formData.categories.includes(category.id)
                          ? 'rgba(52, 152, 219, 0.2)'
                          : 'rgba(52, 152, 219, 0.05)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = formData.categories.includes(category.id)
                          ? 'rgba(52, 152, 219, 0.1)'
                          : 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(category.id)}
                        onChange={() => {}}
                        style={{
                          width: '18px',
                          height: '18px',
                          accentColor: '#3498db',
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        color: '#2c3e50',
                        fontSize: '0.9rem',
                        fontWeight: formData.categories.includes(category.id) ? 600 : 400
                      }}>
                        {category.name}
                      </span>
                    </div>
                  )) : (
                    <div style={{
                      padding: '1rem',
                      textAlign: 'center',
                      color: '#7f8c8d',
                      fontStyle: 'italic'
                    }}>
                      No categories available
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#2c3e50',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}>
            Tags
          </label>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <input
              type="text"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid #e0e6ed',
                borderRadius: '12px',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                background: 'rgba(255, 255, 255, 0.9)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3498db';
                e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e6ed';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '12px',
                background: tagInput.trim() 
                  ? 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)'
                  : '#bdc3c7',
                color: 'white',
                cursor: tagInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              <Plus size={20} />
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              padding: '1rem',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.9)'
            }}>
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: '0',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            style={{
              padding: '1rem 2rem',
              border: '2px solid #e0e6ed',
              borderRadius: '12px',
              background: 'white',
              color: '#7f8c8d',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = '#e74c3c';
                e.currentTarget.style.color = '#e74c3c';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = '#e0e6ed';
                e.currentTarget.style.color = '#7f8c8d';
              }
            }}
          >
            Clear
          </button>
          
          <button
            type="submit"
            disabled={isLoading || !configChecked}
            style={{
              padding: '1rem 2rem',
              border: 'none',
              borderRadius: '12px',
              background: isLoading 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              boxShadow: isLoading 
                ? 'none' 
                : '0 4px 15px rgba(52, 152, 219, 0.4)',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.4)';
              }
            }}
          >
            {isLoading ? '⏳ Uploading...' : '🚀 Upload PDF'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuestUpload;
