import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, User, MessageSquare, ArrowLeft, Tag, Plus } from 'lucide-react';
import EmailService from '../services/emailService';

const CategoryRequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    categoryName: '',
    description: '',
    examples: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!formData.categoryName.trim()) {
      toast.error('Please enter the category name');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please provide a description for the category');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Send email notification to admin
      const emailSent = await EmailService.sendCategoryRequest({
        name: formData.name,
        email: formData.email,
        categoryName: formData.categoryName,
        description: formData.description,
        examples: formData.examples
      });

      if (emailSent) {
        toast.success('Category request sent successfully! We\'ll review it and get back to you.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          categoryName: '',
          description: '',
          examples: ''
        });
      } else {
        // Fallback to mailto if email service fails
        const subject = encodeURIComponent('New Category Request');
        const body = encodeURIComponent(`Category Request Details:

Name: ${formData.name}
Email: ${formData.email}
Category Name: ${formData.categoryName}
Description: ${formData.description}
Examples: ${formData.examples}

Please review this category request.`);
        
        window.open(`mailto:admin@example.com?subject=${subject}&body=${body}`, '_blank');
        toast.success('Opening email client to send your request...');
      }
    } catch (error) {
      console.error('Error sending category request:', error);
      
      // Fallback to mailto
      const subject = encodeURIComponent('New Category Request');
      const body = encodeURIComponent(`Category Request Details:

Name: ${formData.name}
Email: ${formData.email}
Category Name: ${formData.categoryName}
Description: ${formData.description}
Examples: ${formData.examples}

Please review this category request.`);
      
      window.open(`mailto:admin@example.com?subject=${subject}&body=${body}`, '_blank');
      toast.success('Opening email client to send your request...');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#7f8c8d',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#3498db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#7f8c8d';
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Plus size={40} color="white" />
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2c3e50',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Request New Category
          </h1>
          
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem',
            margin: 0,
            lineHeight: 1.5
          }}>
            Suggest a new category for our PDF library
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Name Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Your Name *
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bdc3c7'
                }}
              />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bdc3c7'
                }}
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Category Name Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Category Name *
            </label>
            <div style={{ position: 'relative' }}>
              <Tag
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#bdc3c7'
                }}
              />
              <input
                type="text"
                value={formData.categoryName}
                onChange={(e) => handleInputChange('categoryName', e.target.value)}
                placeholder="e.g., Machine Learning, History, Cooking"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Category Description *
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '1rem',
                  color: '#bdc3c7'
                }}
              />
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what types of documents would belong in this category..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Examples Field */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              Examples (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '1rem',
                  color: '#bdc3c7'
                }}
              />
              <textarea
                value={formData.examples}
                onChange={(e) => handleInputChange('examples', e.target.value)}
                placeholder="Provide examples of documents that would fit in this category..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #ecf0f1',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.boxShadow = '0 0 0 3px rgba(52, 152, 219, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ecf0f1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem',
              border: 'none',
              borderRadius: '12px',
              background: isSubmitting 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: isSubmitting 
                ? 'none' 
                : '0 8px 25px rgba(155, 89, 182, 0.3)'
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(155, 89, 182, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(155, 89, 182, 0.3)';
              }
            }}
          >
            <Plus size={20} />
            {isSubmitting ? 'Sending Request...' : 'Submit Request'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#6c757d',
            lineHeight: 1.4
          }}>
            <strong>Note:</strong> Category requests are reviewed by our admin team. 
            We'll email you once your category has been approved and added to the library.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryRequestPage;
