import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { guestAuth } from '../../config/firebase-guest';

interface GuestAuthProps {
  onAuthSuccess: () => void;
}

const GuestAuth: React.FC<GuestAuthProps> = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    if (!formData.password.trim()) {
      toast.error('Please enter your password');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await signInWithEmailAndPassword(guestAuth, formData.email, formData.password);
      toast.success('Welcome back!');
      onAuthSuccess();
      
    } catch (error: any) {
      console.error('Guest auth error:', error);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email');
          break;
        case 'auth/wrong-password':
          toast.error('Incorrect password');
          break;
        case 'auth/invalid-email':
          toast.error('Invalid email address');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later');
          break;
        default:
          toast.error('Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
        maxWidth: '450px',
        width: '100%'
      }}>
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
            background: 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <UserPlus size={40} color="white" />
          </div>
          
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
            Guest Sign In
          </h1>
          
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem',
            margin: 0,
            lineHeight: 1.5
          }}>
            Sign in to access the PDF upload dashboard
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
              Email
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
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  opacity: isLoading ? 0.6 : 1
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
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
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
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  border: '2px solid #e0e6ed',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  background: 'rgba(255, 255, 255, 0.9)',
                  opacity: isLoading ? 0.6 : 1
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
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              border: 'none',
              background: isLoading 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #3498db 0%, #9b59b6 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: '12px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
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
            {isLoading ? '⏳ Authenticating...' : '🚀 Enter Dashboard'}
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(52, 152, 219, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(52, 152, 219, 0.2)'
        }}>
          <h3 style={{
            margin: '0 0 0.5rem 0',
            color: '#2c3e50',
            fontSize: '1rem',
            fontWeight: 600
          }}>
            🔒 Guest Access Features
          </h3>
          <ul style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            color: '#7f8c8d',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            <li>✅ Upload PDF files up to 25MB</li>
            <li>✅ Add titles, descriptions, and tags</li>
            <li>✅ Categorize your uploads</li>
            <li>✅ Share with the community</li>
          </ul>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{
            color: '#7f8c8d',
            fontSize: '0.9rem',
            margin: 0
          }}>
            Don't have an account?{' '}
            <Link 
              to="/request"
              style={{
                color: '#3498db',
                textDecoration: 'none',
                fontWeight: 600,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderBottomColor = '#3498db';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestAuth;
