import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuestAuth } from '../hooks/useGuestAuth';
import GuestAuth from '../components/auth/GuestAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GuestLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { guestUser, loading } = useGuestAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (guestUser && !loading) {
      navigate('/guest-dashboard');
    }
  }, [guestUser, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is already authenticated, don't show login form
  if (guestUser) {
    return <LoadingSpinner />;
  }

  const handleAuthSuccess = () => {
    navigate('/guest-dashboard');
  };

  return (
    <GuestAuth onAuthSuccess={handleAuthSuccess} />
  );
};

export default GuestLoginPage;
