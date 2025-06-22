import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Button, Typography } from '@mui/material';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { FileData } from '../types/types';

interface FilePreviewProps {
  file: FileData;
  open: boolean;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, open, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    // In a real app, this would trigger a download
    console.log('Downloading file:', file.name);
  };

  const resetView = () => {
    setZoom(100);
    setRotation(0);
  };

  React.useEffect(() => {
    if (open) {
      resetView();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className: 'bg-gray-900 text-white',
        style: { minHeight: '80vh' }
      }}
    >
      <DialogTitle className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <Typography variant="h6" className="text-white truncate">
            {file.name}
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="contained"
            size="small"
            startIcon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Download
          </Button>
          <IconButton onClick={onClose} className="text-white">
            <X className="w-5 h-5" />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent className="p-0 bg-gray-800 flex flex-col">
        {/* Controls */}
        {file.type.startsWith('image/') && (
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-900">
            <Button
              variant="outlined"
              size="small"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="text-white border-gray-600"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Typography variant="body2" className="text-white min-w-0">
              {zoom}%
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="text-white border-gray-600"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRotate}
              className="text-white border-gray-600"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={resetView}
              className="text-gray-400"
            >
              Reset
            </Button>
          </div>
        )}

        {/* Preview Content */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          {file.type.startsWith('image/') && file.previewUrl ? (
            <img
              src={file.previewUrl}
              alt={file.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            />
          ) : file.type === 'application/pdf' ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Typography variant="h3" className="text-red-600 font-bold">
                  PDF
                </Typography>
              </div>
              <Typography variant="h6" className="text-white mb-2">
                PDF Preview
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                PDF preview would be displayed here in a real application
              </Typography>
              <Button
                variant="contained"
                onClick={handleDownload}
                className="bg-red-600 hover:bg-red-700"
              >
                Download to View
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Typography variant="h6" className="text-white mb-2">
                Preview not available
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                This file type cannot be previewed
              </Typography>
              <Button
                variant="contained"
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;