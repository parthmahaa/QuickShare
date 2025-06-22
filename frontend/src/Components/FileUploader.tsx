import React, { useState, useCallback } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Alert } from '@mui/material';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { FileData } from '../types/types';
import ShareSettings from './ShareSettings';
import { generateShareCode, generateShareLink } from '../utils/share-utils';

interface FileUploaderProps {
  onFileUpload: (files: FileData[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<FileData[]>([]);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return `File "${file.name}" exceeds 50MB limit`;
    }
    return null;
  };

  const simulateUpload = async (fileData: FileData): Promise<void> => {
    const updateProgress = (progress: number) => {
      setUploadingFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, uploadProgress: progress } : f)
      );
    };

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      updateProgress(progress);
    }

    // Mark as completed
    setUploadingFiles(prev => 
      prev.map(f => f.id === fileData.id ? { ...f, status: 'completed' as const } : f)
    );

    // Move to completed files after a brief delay
    setTimeout(() => {
      setUploadingFiles(prev => prev.filter(f => f.id !== fileData.id));
      onFileUpload([{ ...fileData, status: 'completed', uploadProgress: 100 }]);
    }, 500);
  };

  const processFiles = async (files: FileList, expirationHours: number = 24) => {
    setError('');
    const newFiles: FileData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
        continue;
      }

      const fileData: FileData = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
        shareCode: generateShareCode(),
        shareLink: generateShareLink(),
        downloadCount: 0,
        isExpired: false,
        uploadProgress: 0,
        status: 'uploading',
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      };

      newFiles.push(fileData);
    }

    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Start upload simulation for each file
    newFiles.forEach(fileData => {
      simulateUpload(fileData);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (type === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="shadow-xl">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-50/50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`w-16 h-16 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <Typography variant="h5" className="font-semibold mb-2">
              {dragActive ? 'Drop your files here' : 'Drag & drop your files'}
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-6">
              or click to browse • Maximum file size: 50MB
            </Typography>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer"
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose Files
            </label>
          </div>

          <ShareSettings onSettingsChange={(settings) => console.log('Settings:', settings)} />
        </CardContent>
      </Card>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Uploading Files ({uploadingFiles.length})
            </Typography>
            <div className="space-y-4">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <Typography variant="body2" className="font-medium truncate">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </div>
                  </div>
                  <div className="flex-1 max-w-xs">
                    <Box className="flex items-center space-x-2">
                      <LinearProgress
                        variant="determinate"
                        value={file.uploadProgress}
                        className="flex-1"
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                          },
                        }}
                      />
                      <Typography variant="caption" className="text-gray-600 w-12 text-right">
                        {file.uploadProgress}%
                      </Typography>
                    </Box>
                  </div>
                  <button
                    onClick={() => removeUploadingFile(file.id)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;