import React, { useState } from 'react';
import { imagekitDualService } from '../../services/imagekitDualService';
import toast from 'react-hot-toast';

const ImageKitTestTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    try {
      const result = await imagekitDualService.uploadPDF(selectedFile);
      setUploadResult(result);
      toast.success(`File uploaded successfully to ${result.provider}!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const fileSizeMB = selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0';
  const willUseSmallAccount = selectedFile && selectedFile.size < 10 * 1024 * 1024;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">ImageKit Dual Account Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-4 rounded">
            <h4 className="font-semibold mb-2">File Details:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Name:</strong> {selectedFile.name}</div>
              <div><strong>Size:</strong> {fileSizeMB} MB</div>
              <div>
                <strong>Will use:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  willUseSmallAccount 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {willUseSmallAccount ? 'Small Account (< 10MB)' : 'Main Account (≥ 10MB)'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Test Upload'}
        </button>

        {uploadResult && (
          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-2">Upload Successful!</h4>
            <div className="text-sm space-y-1">
              <div><strong>Provider:</strong> {uploadResult.provider}</div>
              <div><strong>File ID:</strong> {uploadResult.fileId}</div>
              <div><strong>URL:</strong> <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{uploadResult.url}</a></div>
              <div><strong>Size:</strong> {(uploadResult.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">📋 Account Setup Status:</h4>
        <div className="space-y-1">
          <div>
            <span className="text-green-600">✓</span> Main Account: Configured for files 10-25MB
          </div>
          <div>
            <span className={import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY ? "text-green-600" : "text-red-600"}>
              {import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY ? "✓" : "✗"}
            </span> Small Account: {import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY ? "Configured" : "Needs setup"}
          </div>
          {!import.meta.env.VITE_IMAGEKIT_SMALL_PUBLIC_KEY && (
            <div className="text-red-600 text-xs mt-2">
              Please set up your small account credentials in the .env file
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageKitTestTool;
