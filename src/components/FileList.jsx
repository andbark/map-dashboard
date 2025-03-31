import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getAllFiles } from '@/lib/database';

const FileList = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const result = await getAllFiles();
      if (result.success) {
        setFiles(result.files);
      } else {
        setError('Failed to load files');
      }
    } catch (error) {
      setError('Error loading files');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    loadFiles
  }));

  useEffect(() => {
    loadFiles();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type.startsWith('video/')) {
      return '🎥';
    } else if (type.startsWith('audio/')) {
      return '🎵';
    } else if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return '📊';
    } else if (type.includes('document') || type.includes('word')) {
      return '📝';
    } else {
      return '📁';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      
      {files.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No files uploaded yet
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="text-2xl">{getFileIcon(file.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{file.filename}</h3>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  Uploaded {new Date(file.createdAt).toLocaleDateString()}
                </p>
              </div>

              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

FileList.displayName = 'FileList';

export default FileList; 