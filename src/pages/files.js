import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { useRef } from 'react';

export default function FilesPage() {
  const fileListRef = useRef();

  const handleUploadSuccess = () => {
    // Refresh the file list after successful upload
    fileListRef.current?.loadFiles();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          File Management
        </h1>
        
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        
        <div className="mt-8">
          <FileList ref={fileListRef} />
        </div>
      </div>
    </div>
  );
} 