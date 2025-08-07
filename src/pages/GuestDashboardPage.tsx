import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGuestAuth } from '../hooks/useGuestAuth';
import GuestDashboardLayout from '../components/dashboardG/GuestDashboardLayout';
import GuestUpload from '../components/dashboardG/GuestUpload';
import LoadingSpinner from '../components/common/LoadingSpinner';

const GuestDashboardPage: React.FC = () => {
  const { guestUser, loading } = useGuestAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to guest login if not authenticated
  if (!guestUser) {
    return <Navigate to="/guest-login" replace />;
  }

  return (
    <GuestDashboardLayout>
      <GuestUpload />
    </GuestDashboardLayout>
  );
};

export default GuestDashboardPage;
