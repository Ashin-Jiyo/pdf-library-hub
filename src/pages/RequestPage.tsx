import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, User, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import EmailService from '../services/emailService';

const RequestPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: ''
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
    
    if (!formData.reason.trim()) {
      toast.error('Please explain why you need access');
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
      const emailSent = await EmailService.sendAccessRequest({
        name: formData.name,
        email: formData.email,
        reason: formData.reason
      });

      if (emailSent) {
        toast.success('Access request submitted! We\'ll review and get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          reason: ''
        });
      } else {
        toast.error('Failed to send request. Please try again or contact support.');
      }
      
    } catch (error) {
      console.error('Request submission error:', error);
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%'
      }}>
        {/* Back Button */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/guest-login"
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
            Back to Sign In
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
            background: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <Send size={40} color="white" />
          </div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2c3e50',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Request Access
          </h1>
          
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem',
            margin: 0,
            lineHeight: 1.5
          }}>
            Tell us why you need guest upload access and we'll review your request
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              Your Name
            </label>
            <div style={{ position: 'relative' }}>
              <User 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d'
                }}
              />
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  opacity: isSubmitting ? 0.6 : 1
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
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#7f8c8d'
                }}
              />
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  opacity: isSubmitting ? 0.6 : 1
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
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              Why do you need access?
            </label>
            <div style={{ position: 'relative' }}>
              <MessageSquare 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '1rem',
                  color: '#7f8c8d'
                }}
              />
              <textarea
                placeholder="Please explain why you need upload access. For example: educational purposes, sharing study materials, etc."
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                disabled={isSubmitting}
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  opacity: isSubmitting ? 0.6 : 1,
                  resize: 'vertical',
                  minHeight: '120px'
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
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem',
              border: 'none',
              background: isSubmitting 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #e74c3c 0%, #f39c12 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              boxShadow: isSubmitting 
                ? 'none' 
                : '0 4px 15px rgba(231, 76, 60, 0.4)',
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.4)';
              }
            }}
          >
            {isSubmitting ? '📧 Sending Request...' : '🚀 Submit Request'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(231, 76, 60, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(231, 76, 60, 0.2)'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#2c3e50',
            fontSize: '1rem',
            fontWeight: 600
          }}>
            📋 What happens next?
          </h3>
          <ul style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            color: '#7f8c8d',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            textAlign: 'left'
          }}>
            <li>✅ We'll review your request within few days</li>
            <li>✅ You'll receive an email with your account details</li>
            <li>✅ Once approved, you can start uploading PDFs</li>
            <li>✅ Your uploads will be shared with the community</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
