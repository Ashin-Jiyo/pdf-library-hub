import React, { useState } from 'react';
import { pdfUrlMigration } from '../../utils/pdfUrlMigration';
import toast from 'react-hot-toast';

interface MigrationResult {
  total: number;
  accessible: number;
  inaccessible: Array<{
    id: string;
    title: string;
    pdfUrl?: string;
  }>;
}

const PDFUrlMigrationTool: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [report, setReport] = useState<string>('');

  const handleCheckUrls = async () => {
    setIsChecking(true);
    try {
      const result = await pdfUrlMigration.checkAllPdfUrls();
      setMigrationResult(result);
      toast.success(`Checked ${result.total} PDFs. ${result.inaccessible.length} have issues.`);
    } catch (error) {
      console.error('Error checking URLs:', error);
      toast.error('Failed to check PDF URLs');
    } finally {
      setIsChecking(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const reportText = await pdfUrlMigration.generateReport();
      setReport(reportText);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">PDF URL Health Check</h3>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={handleCheckUrls}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Check All PDFs'}
          </button>
          
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Generate Report
          </button>
        </div>

        {migrationResult && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Check Results:</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total PDFs:</span>
                <span className="ml-2 font-semibold">{migrationResult.total}</span>
              </div>
              <div>
                <span className="text-green-600">Accessible:</span>
                <span className="ml-2 font-semibold text-green-600">{migrationResult.accessible}</span>
              </div>
              <div>
                <span className="text-red-600">Issues:</span>
                <span className="ml-2 font-semibold text-red-600">{migrationResult.inaccessible.length}</span>
              </div>
            </div>
            
            {migrationResult.inaccessible.length > 0 && (
              <div className="mt-4">
                <h5 className="font-semibold text-red-600 mb-2">PDFs with Issues:</h5>
                <div className="max-h-40 overflow-y-auto">
                  {migrationResult.inaccessible.map((pdf) => (
                    <div key={pdf.id} className="text-sm py-1">
                      • {pdf.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {report && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">Health Check Report:</h4>
            <pre className="text-sm whitespace-pre-wrap max-h-60 overflow-y-auto bg-white p-3 rounded border">
              {report}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">ℹ️ About URL Health Checks:</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>All new uploads now use ImageKit for reliable storage</li>
          <li>Legacy Cloudinary URLs may need manual attention if inaccessible</li>
          <li>External links depend on the source website's availability</li>
          <li>This tool helps identify broken or problematic URLs</li>
        </ul>
      </div>
    </div>
  );
};

export default PDFUrlMigrationTool;
