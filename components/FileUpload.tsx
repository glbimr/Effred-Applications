import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  file, 
  onFileChange, 
  accept = ".pdf,.doc,.docx", 
  maxSizeMB = 5 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    onFileChange(selectedFile);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Resume / CV <span className="text-red-500">*</span>
      </label>
      
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer
            ${isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            }
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleInputChange}
            accept={accept}
          />
          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
            <div className={`p-3 rounded-full ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'} transition-colors`}>
              <UploadCloud size={24} />
            </div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-slate-400">PDF, DOC, DOCX (Max {maxSizeMB}MB)</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg text-indigo-600">
              <FileText size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-[300px]">
                {file.name}
              </span>
              <span className="text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
    </div>
  );
};