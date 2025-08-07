import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import PDFUrlMigrationTool from '../components/dashboard/PDFUrlMigrationTool';
import ImageKitTestTool from '../components/dashboard/ImageKitTestTool';

const PDFMigrationPage: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dual ImageKit Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor PDF uploads and test the dual ImageKit account system
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-2">📋 Upload Service Changes</h3>
          <p className="text-blue-700 text-sm">
            Your application now uses dual ImageKit accounts for better quota management:
            Small files (&lt; 10MB) → Small Account, Large files (10-25MB) → Main Account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PDFUrlMigrationTool />
          <ImageKitTestTool />
        </div>
        
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold mb-2">✅ Dual ImageKit Benefits</h3>
          <div className="text-green-700 text-sm space-y-2">
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Doubled free tier limits (40GB total bandwidth/month)</li>
              <li>Better quota management with size-based routing</li>
              <li>Load distribution across two accounts</li>
              <li>Support for files up to 25MB</li>
              <li>Reliable file access without ACL issues</li>
              <li>Organized file management by size</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PDFMigrationPage;
