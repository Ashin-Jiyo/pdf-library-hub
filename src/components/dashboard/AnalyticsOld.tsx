import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Eye, 
  Download, 
  Calendar,
  Activity
} from 'lucide-react';
import { usePDFs } from '../../hooks/usePDF';
import LoadingSpinner from '../common/LoadingSpinner';

const Analytics: React.FC = () => {
  const { data: pdfs, isLoading } = usePDFs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate analytics data
  const totalPDFs = pdfs?.length || 0;
  const totalViews = pdfs?.reduce((sum, pdf) => sum + pdf.viewCount, 0) || 0;
  const totalDownloads = pdfs?.reduce((sum, pdf) => sum + pdf.downloadCount, 0) || 0;
  
  const thisMonth = new Date();
  const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
  
  const thisMonthPDFs = pdfs?.filter(pdf => {
    const pdfDate = new Date(pdf.createdAt);
    return pdfDate >= lastMonth;
  }).length || 0;

  const avgViewsPerPDF = totalPDFs > 0 ? Math.round(totalViews / totalPDFs) : 0;
  const avgDownloadsPerPDF = totalPDFs > 0 ? Math.round(totalDownloads / totalPDFs) : 0;

  const topPDFs = pdfs?.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5) || [];
  const recentPDFs = pdfs?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your PDF library performance and engagement metrics</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total PDFs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalPDFs}</p>
              <p className="text-sm text-green-600 mt-1">+{thisMonthPDFs} this month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalViews.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Avg: {avgViewsPerPDF} per PDF</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalDownloads.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">Avg: {avgDownloadsPerPDF} per PDF</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Download size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalViews > 0 ? Math.round((totalDownloads / totalViews) * 100) : 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Downloads per view</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2" />
            Performance Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Views</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((totalViews / Math.max(totalViews, 100)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {totalViews}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Downloads</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((totalDownloads / Math.max(totalViews, 1)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {totalDownloads}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">PDFs</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min((totalPDFs / Math.max(totalPDFs, 10)) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {totalPDFs}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity size={20} className="mr-2" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentPDFs.slice(0, 4).map((pdf) => (
              <div key={pdf.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">PDF uploaded: "{pdf.title}"</p>
                  <p className="text-xs text-gray-500">
                    {new Date(pdf.createdAt).toLocaleDateString()} - {pdf.viewCount} views
                  </p>
                </div>
              </div>
            ))}
            {recentPDFs.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Performing PDFs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Performing PDFs</h2>
        </div>
        <div className="p-6">
          {topPDFs.length > 0 ? (
            <div className="space-y-4">
              {topPDFs.map((pdf, index) => (
                <div key={pdf.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{pdf.title}</h3>
                        <p className="text-sm text-gray-500">by {pdf.author}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{pdf.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download size={14} />
                      <span>{pdf.downloadCount}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(pdf.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText size={32} className="text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No PDFs available for analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
