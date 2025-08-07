import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Dashboard Components (to be created)
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PDFManagement from '../components/dashboard/PDFManagement';
import CategoryManagement from '../components/dashboard/CategoryManagement';
import UploadPDF from '../components/dashboard/UploadPDF';
import Analytics from '../components/dashboard/Analytics';
import Settings from '../components/dashboard/Settings';

const DashboardPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="pdfs" replace />} />
        <Route path="pdfs" element={<PDFManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="upload" element={<UploadPDF />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardPage;
