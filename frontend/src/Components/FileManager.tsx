import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Chip, Alert } from '@mui/material';
import { FileText, Image, File, Download, Share, Trash2, Eye, Clock, Copy } from 'lucide-react';
import { FileData } from '../types/types';
import FilePreview from './FilePreview';

interface FileManagerProps {
  files: FileData[];
  onDeleteFile: (id: string) => void;
  onUpdateFile: (id: string, updates: Partial<FileData>) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ files, onDeleteFile, onUpdateFile }) => {
  const [previewFile, setPreviewFile] = useState<FileData | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="w-6 h-6 text-red-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const canPreview = (file: FileData) => {
    return file.type.startsWith('image/') || file.type === 'application/pdf';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <Typography variant="h6" className="text-gray-600 mb-2">
          No files uploaded yet
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          Upload some files to see them here
        </Typography>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Typography variant="h4" className="font-bold text-white mb-2">
          Your Files
        </Typography>
        <Typography variant="body1" className="text-white/80">
          Manage and share your uploaded files
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <Card key={file.id} className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <Typography variant="subtitle1" className="font-semibold truncate">
                      {file.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {formatFileSize(file.size)}
                    </Typography>
                  </div>
                </div>
                <Chip
                  size="small"
                  label={file.isExpired ? 'Expired' : 'Active'}
                  color={file.isExpired ? 'error' : 'success'}
                  variant="outlined"
                />
              </div>

              {file.previewUrl && (
                <div className="mb-4">
                  <img
                    src={file.previewUrl}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Expires in</span>
                  </span>
                  <span className="font-medium">
                    {file.expiresAt ? formatTimeRemaining(file.expiresAt) : 'Never'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>Downloads</span>
                  </span>
                  <span className="font-medium">{file.downloadCount}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Typography variant="caption" className="text-gray-600">
                      Share Code
                    </Typography>
                    <div className="flex items-center space-x-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {file.shareCode}
                      </code>
                      <Button
                        size="small"
                        onClick={() => copyToClipboard(file.shareCode, 'code')}
                        className="min-w-0 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Share className="w-4 h-4" />}
                    onClick={() => copyToClipboard(file.shareLink, 'link')}
                    className="text-xs"
                  >
                    {copiedCode === file.shareLink ? 'Link Copied!' : 'Copy Share Link'}
                  </Button>
                </div>

                <div className="flex space-x-2">
                  {canPreview(file) && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Eye className="w-4 h-4" />}
                      onClick={() => setPreviewFile(file)}
                      className="flex-1"
                    >
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<Trash2 className="w-4 h-4" />}
                    onClick={() => onDeleteFile(file.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {copiedCode && (
        <Alert severity="success" className="fixed bottom-4 right-4 z-50">
          Copied to clipboard!
        </Alert>
      )}

      {previewFile && (
        <FilePreview
          file={previewFile}
          open={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
};

export default FileManager;