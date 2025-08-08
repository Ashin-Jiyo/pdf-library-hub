import React, { useState, useMemo, useEffect } from 'react';
import { Search, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PDFDocument } from '../types';

// Components (to be created)
import PDFCard from '../components/pdf/PDFCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TextType from '../components/common/TextType';
import LetterGlitch from '../components/common/LetterGlitch';

// Hooks
import { usePDFs } from '../hooks/usePDF';
import { useCategories } from '../hooks/useCategories';
import { useTypingPlaceholder } from '../hooks/useTypingPlaceholder';

// Utilities
import { getAssetPath } from '../utils/assets';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'most-viewed'>('newest');
  
  const navigate = useNavigate();
  const { data: pdfs, isLoading: pdfsLoading } = usePDFs();
  const { data: dashboardCategories, isLoading: categoriesLoading } = useCategories();
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  // Animate search input placeholder with typing effect (must be before any early returns)
  useTypingPlaceholder(
    searchInputRef,
    [
      'Search PDFs by title, author, or content...',
      'Try keywords like: Short notes, Physics, Trigonometry',
      'Filter by categories and tags too!'
    ],
    { typeSpeed: 35, deleteSpeed: 20, delayBetween: 1100, startDelay: 500, pauseOnFocus: true }
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if the click is outside both dropdown containers
      const categoryDropdown = document.querySelector('.category-dropdown-container');
      const sortDropdown = document.querySelector('.sort-dropdown-container');
      
      if (categoryDropdown && !categoryDropdown.contains(target)) {
        setShowCategoryDropdown(false);
      }
      if (sortDropdown && !sortDropdown.contains(target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    // Filter and sort PDFs based on search term, selected categories, and sort order
  const filteredPDFs = useMemo(() => {
    if (!pdfs) return [];
    
    let filtered = pdfs.filter((pdf: PDFDocument) => {
      const matchesSearch = searchTerm === '' || 
        pdf.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pdf.tags && pdf.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = selectedCategories.length === 0 ||
        pdf.categories.some((cat: string) => selectedCategories.includes(cat));
      
      return matchesSearch && matchesCategory;
    });

    // Sort the filtered PDFs
    if (sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === 'most-viewed') {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    }

    return filtered;
  }, [pdfs, searchTerm, selectedCategories, sortOrder]);

  // Get categories from dashboard only (deleted categories won't appear)
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    
    // Only add categories from dashboard (this respects deletions)
    if (dashboardCategories) {
      dashboardCategories.forEach(category => {
        categorySet.add(category.name);
      });
    }
    
    return Array.from(categorySet).sort();
  }, [dashboardCategories]);

  if (pdfsLoading || categoriesLoading) {
    return <LoadingSpinner renderGlitchBg message="Loading..." />;
  }

  return (
    <div className="main-container" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fullscreen animated background */}
      <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} zIndex={0} />
      <div className="content-wrapper">
        {/* Hero Section */}
        <div className="hero-section glass">
          {/* Logo */}
          <div className="logo-container">
            <img 
              src={getAssetPath('/logow.svg')} 
              alt="Tea Time Study Logo" 
              className="logo"
            />
          </div>
          
          <h1
            className="hero-title"
            style={{
              color: '#ffffff',
              fontWeight: 600,
              fontFamily: 'Jua, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
            }}
          >
            <TextType
              words={["Tea Time Study"]}
              typeSpeed={60}
              deleteSpeed={0}
              delayBetween={0}
              loop={false}
              ariaLabel="Tea Time Study title"
              cursorChar=""
            />
          </h1>
          <p className="hero-description" style={{color: '#ffffff', minHeight: '2.5em'}}>
            <TextType
              words={[
                "Welcome to Tea Time Study! It's great to have you here!",
                'Discover, sip, and study with our cozy collection of notes and resources!'
              ]}
              typeSpeed={45}
              deleteSpeed={25}
              delayBetween={1200}
              loop
              ariaLabel="Homepage hero typing text"
              cursorChar="|"
            />
          </p>
        </div>

        {/* Search and Filters */}
        <div className="search-section glass">
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PDFs by title, author, or content..."
              className="glass"
              style={{
                flexGrow: 1,
                minWidth: '250px',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                outline: 'none',
                color: '#ffffff',
                fontWeight: '500'
              }}
            />
            
            <div className="relative category-dropdown-container" style={{position: 'relative', zIndex: 200}}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowSortDropdown(false); // Close other dropdown
                }}
                className="glass"
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  color: '#ffffff',
                  fontWeight: '500'
                }}
              >
                {selectedCategories.length === 0 ? 'All Categories' : `${selectedCategories.length} Selected`} ▾
              </button>
              {showCategoryDropdown && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '200px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 9999,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)'
                }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: selectedCategories.length === 0 ? 'rgba(91, 130, 245, 0.1)' : 'transparent',
                      color: '#1f2937',
                      borderRadius: '8px 8px 0 0'
                    }}
                    onClick={() => {
                      setSelectedCategories([]);
                      setShowCategoryDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 130, 245, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = selectedCategories.length === 0 ? 'rgba(91, 130, 245, 0.1)' : 'transparent';
                    }}
                  >
                    All Categories {selectedCategories.length === 0 && <span style={{float: 'right', color: '#5b82f5'}}>✓</span>}
                  </div>
                  {availableCategories.map((categoryName) => (
                    <div
                      key={categoryName}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        backgroundColor: selectedCategories.includes(categoryName) ? 'rgba(91, 130, 245, 0.1)' : 'transparent',
                        color: '#1f2937'
                      }}
                      onClick={() => {
                        if (selectedCategories.includes(categoryName)) {
                          setSelectedCategories(prev => prev.filter(c => c !== categoryName));
                        } else {
                          setSelectedCategories(prev => [...prev, categoryName]);
                        }
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(91, 130, 245, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedCategories.includes(categoryName) ? 'rgba(91, 130, 245, 0.1)' : 'transparent';
                      }}
                    >
                      {categoryName} {selectedCategories.includes(categoryName) && <span style={{float: 'right', color: '#5b82f5'}}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative sort-dropdown-container" style={{position: 'relative', zIndex: 200}}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSortDropdown(!showSortDropdown);
                  setShowCategoryDropdown(false); // Close other dropdown
                }}
                className="glass"
                style={{
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  whiteSpace: 'nowrap',
                  color: '#ffffff',
                  fontWeight: '500'
                }}
              >
                ↗ {sortOrder === 'newest' ? 'Latest' : sortOrder === 'oldest' ? 'Oldest' : 'Most Viewed'} ▾
              </button>
              {showSortDropdown && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '150px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 9999,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)'
                }}>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: sortOrder === 'newest' ? 'rgba(91, 130, 245, 0.1)' : 'transparent',
                      color: '#1f2937',
                      borderRadius: '8px 8px 0 0'
                    }}
                    onClick={() => {
                      setSortOrder('newest');
                      setShowSortDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 130, 245, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = sortOrder === 'newest' ? 'rgba(91, 130, 245, 0.1)' : 'transparent';
                    }}
                  >
                    Latest {sortOrder === 'newest' && <span style={{float: 'right', color: '#5b82f5'}}>✓</span>}
                  </div>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: sortOrder === 'oldest' ? 'rgba(91, 130, 245, 0.1)' : 'transparent',
                      color: '#1f2937'
                    }}
                    onClick={() => {
                      setSortOrder('oldest');
                      setShowSortDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 130, 245, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = sortOrder === 'oldest' ? 'rgba(91, 130, 245, 0.1)' : 'transparent';
                    }}
                  >
                    Oldest {sortOrder === 'oldest' && <span style={{float: 'right', color: '#5b82f5'}}>✓</span>}
                  </div>
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      backgroundColor: sortOrder === 'most-viewed' ? 'rgba(91, 130, 245, 0.1)' : 'transparent',
                      color: '#1f2937',
                      borderRadius: '0 0 8px 8px'
                    }}
                    onClick={() => {
                      setSortOrder('most-viewed');
                      setShowSortDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(91, 130, 245, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = sortOrder === 'most-viewed' ? 'rgba(91, 130, 245, 0.1)' : 'transparent';
                    }}
                  >
                    Most Viewed {sortOrder === 'most-viewed' && <span style={{float: 'right', color: '#5b82f5'}}>✓</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p style={{
            fontSize: '1rem',
            color: '#ffffff',
            marginLeft: '0.25rem'
          }}>
            {filteredPDFs.length} document{filteredPDFs.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Results */}
        <div className="results-section glass">
          {filteredPDFs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              paddingTop: '5rem',
              paddingBottom: '5rem'
            }}>
              <Search size={72} style={{
                margin: '0 auto 2rem',
                color: '#d1d5db'
              }} />
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                 No PDFs found
              </h3>
              <p style={{
                color: '#ffffff',
                fontSize: '1.125rem',
                maxWidth: '24rem',
                margin: '0 auto'
              }}>
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '40px',
                justifyContent: 'center',
                padding: '20px 0',
                maxWidth: '1200px',
                margin: '0 auto'
              }}
            >
              {filteredPDFs.map((pdf: PDFDocument) => (
                <div
                  key={pdf.id}
                  style={{
                    margin: '0',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <PDFCard pdf={pdf} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guest Dashboard Button */}
        <div style={{
          textAlign: 'center',
          padding: '2rem 0 1rem',
          marginTop: '0.5rem'
        }}>
          <button
            onClick={() => navigate('/guest-dashboard')}
            className="glass"
            style={{
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            <Upload size={20} />
            upload your own PDFs
          </button>
        </div>

        {/* Social Media Section */}
        <div style={{
          textAlign: 'center',
          padding: '0.5rem 0 3rem',
          marginTop: '0'
        }}>
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            justifyContent: 'center',
            gap: '1rem',
            width: '100%',
            maxWidth: '100%'
          }}>
            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1877f2';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 119, 242, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://facebook.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#1877f2',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Facebook
              </span>
              <svg
                viewBox="0 0 320 512"
                height="1.2em"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: '#ffffff' }}
              >
                <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0A66C2';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(10, 102, 194, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://www.linkedin.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#0A66C2',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                LinkedIn
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: '#ffffff' }}
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146zM4.943 13.394V6.169H2.542v7.225h2.401zM3.743 4.956c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.358.54-1.358 1.248 0 .694.521 1.248 1.327 1.248h.015zM13.458 13.394V9.349c0-2.218-1.184-3.251-2.764-3.251-1.28 0-1.856.704-2.169 1.201h.016V6.169H6.141c.032.704 0 7.225 0 7.225h2.401V9.804c0-.192.014-.384.072-.521.158-.384.518-.782 1.121-.782.79 0 1.107.59 1.107 1.456v3.436h2.616z"/>
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1da1f2';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 161, 242, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://twitter.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#1da1f2',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Twitter
              </span>
              <svg
                height="1.8em"
                fill="currentColor"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: '#ffffff' }}
              >
                <path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429" />
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e4405f';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(228, 64, 95, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://instagram.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#e4405f',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Instagram
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: '#ffffff' }}
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#333';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(51, 51, 51, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://github.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#333',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                GitHub
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: '#ffffff' }}
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FF0000';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://youtube.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#FF0000',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                YouTube
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: '#ffffff' }}
              >
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#7AB55C';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(122, 181, 92, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://shopify.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#7AB55C',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Shopify
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 50 50"
                style={{ color: '#ffffff' }}
              >
                <path d="M 22.839844 2.0351562 C 19.659152 1.9484924 16.325547 6.1910156 14.529297 12.720703 L 8.8847656 14.560547 C 8.5177656 14.680547 8.2511719 14.999812 8.2011719 15.382812 L 4.7558594 42.193359 C 4.6888594 42.718359 5.0415 43.204734 5.5625 43.302734 L 29.630859 47.882812 L 31.488281 7.1972656 L 30.376953 7.5585938 C 29.713953 5.1145938 28.473844 3.5775156 26.839844 3.2285156 C 26.344844 3.1205156 25.866344 3.1427656 25.402344 3.2597656 C 24.845344 2.6717656 24.203656 2.266375 23.472656 2.109375 C 23.262469 2.0645 23.05189 2.0409338 22.839844 2.0351562 z M 22.720703 4.0371094 C 22.835859 4.0344238 22.948953 4.0437813 23.056641 4.0664062 C 23.227641 4.1034062 23.392734 4.17925 23.552734 4.28125 C 21.567734 5.97825 20.050047 9.1985469 19.248047 11.185547 L 16.847656 11.966797 C 18.482656 6.9417969 20.993363 4.0773926 22.720703 4.0371094 z M 26.65625 5.2675781 C 27.42425 5.5845781 28.071563 6.6167344 28.476562 8.1777344 L 27.453125 8.5117188 C 27.293125 7.2737188 27.02925 6.1775781 26.65625 5.2675781 z M 24.755859 5.9179688 C 25.120859 6.7669688 25.386484 7.865625 25.521484 9.140625 L 21.791016 10.355469 C 22.804016 8.2054687 23.847859 6.7299688 24.755859 5.9179688 z M 33.482422 7.3964844 L 31.636719 47.806641 L 44.216797 45.023438 C 44.728797 44.910438 45.065234 44.421297 44.990234 43.904297 C 43.389234 32.807297 40.349922 11.701203 40.294922 11.283203 C 40.283922 11.183203 40.25875 11.085188 40.21875 10.992188 C 40.02275 10.542188 39.668313 10.219641 39.195312 10.056641 C 39.103313 10.025641 38.993484 10.007906 38.896484 10.003906 C 38.674484 9.9949062 36.702281 9.8413906 35.863281 9.7753906 C 35.177281 9.0743906 33.860578 7.7328281 33.517578 7.4238281 C 33.506578 7.4128281 33.493422 7.4064844 33.482422 7.3964844 z M 22.71875 18.023438 C 24.78275 18.023438 25.880734 18.672172 25.927734 18.701172 C 26.124734 18.820172 26.213578 19.06125 26.142578 19.28125 L 24.630859 23.941406 C 24.584859 24.083406 24.479797 24.196953 24.341797 24.251953 C 24.201797 24.309953 24.046016 24.298516 23.916016 24.228516 C 23.903016 24.221516 22.63025 23.539063 21.15625 23.539062 C 19.37325 23.539062 19.107422 24.451141 19.107422 24.994141 C 19.107422 25.583141 19.880344 26.166844 20.777344 26.839844 C 22.364344 28.031844 24.537109 29.663453 24.537109 32.939453 C 24.537109 37.043453 21.982219 39.912109 18.324219 39.912109 C 14.164219 39.912109 12.069422 37.320937 11.982422 37.210938 C 11.881422 37.083937 11.848531 36.913813 11.894531 36.757812 L 12.957031 33.185547 C 13.006031 33.022547 13.136781 32.894656 13.300781 32.847656 C 13.463781 32.803656 13.641531 32.840172 13.769531 32.951172 C 13.789531 32.969172 15.726719 34.662109 17.261719 34.662109 C 18.154719 34.662109 18.390625 33.946359 18.390625 33.568359 C 18.390625 32.588359 17.673625 31.991328 16.765625 31.236328 C 15.511625 30.194328 13.953125 28.897031 13.953125 26.082031 C 13.953125 22.201031 16.658609 18.025391 22.599609 18.025391 C 22.639609 18.025391 22.67875 18.023438 22.71875 18.023438 z"/>
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFDD00';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 221, 0, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://buymeacoffee.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#FFDD00',
                color: '#000',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Buy Me a Coffee
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ color: '#ffffff' }}
              >
                <path d="m20.216 6.415-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 0 0-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 0 0-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 0 1-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 0 1 3.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 0 1-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 0 1-4.743.295 37.059 37.059 0 0 1-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0 0 11.343.376.483.483 0 0 1 .535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 0 1 .39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 0 1-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 0 1-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 0 0-1.322-.238c-.826 0-1.491.284-2.26.613z"/>
              </svg>
            </li>

            <li style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#BD081C';
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(189, 8, 28, 0.3)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '1';
                tooltip.style.top = '-45px';
                tooltip.style.visibility = 'visible';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              const tooltip = e.currentTarget.querySelector('.tooltip') as HTMLElement;
              if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.top = '0';
                tooltip.style.visibility = 'hidden';
              }
            }}
            onClick={() => window.open('https://pinterest.com', '_blank')}
            >
              <span className="tooltip" style={{
                position: 'absolute',
                top: '0',
                fontSize: '14px',
                background: '#BD081C',
                color: '#fff',
                padding: '5px 8px',
                borderRadius: '5px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                opacity: '0',
                pointerEvents: 'none',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                visibility: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                Pinterest
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.2em"
                fill="currentColor"
                viewBox="0 0 16 16"
                style={{ color: '#ffffff' }}
              >
                <path d="M8 0a8 8 0 0 0-2.915 15.452c-.07-.633-.134-1.606.027-2.297.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.682 0 1.012.512 1.012 1.127 0 .686-.437 1.712-.663 2.663-.188.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A8 8 0 1 0 8 0z"/>
              </svg>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{
        marginTop: '4rem',
        padding: '2rem 1rem',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{
            fontSize: '1.1rem',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Having trouble with the site, need help or have suggestions?{' '}
            <a
              href="https://mail.google.com/mail/?view=cm&to=ashinjiyostudy@gmail.com&su=PDF%20Library%20Hub%20-%20Support%20Request"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#4db6e6',
                textDecoration: 'underline',
                fontWeight: 600,
                transition: 'color 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#66c2ff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#4db6e6';
              }}
            >
              Contact Me
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
