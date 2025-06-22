import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge } from '@mui/material';
import { Upload, FolderOpen, Share2 } from 'lucide-react';

interface HeaderProps {
  activeView: 'upload' | 'manage';
  onViewChange: (view: 'upload' | 'manage') => void;
  fileCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, fileCount }) => {
  return (
    <AppBar 
      position="static" 
      className="bg-white/10 backdrop-blur-md border-b border-white/20"
      elevation={0}
    >
      <Toolbar className="justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-white">
            FileShare Pro
          </Typography>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={activeView === 'upload' ? 'contained' : 'outlined'}
            startIcon={<Upload className="w-4 h-4" />}
            onClick={() => onViewChange('upload')}
            className={`${
              activeView === 'upload' 
                ? 'bg-white text-blue-600 hover:bg-gray-100' 
                : 'text-white border-white/30 hover:bg-white/10'
            }`}
          >
            Upload
          </Button>
          <Badge badgeContent={fileCount} color="secondary">
            <Button
              variant={activeView === 'manage' ? 'contained' : 'outlined'}
              startIcon={<FolderOpen className="w-4 h-4" />}
              onClick={() => onViewChange('manage')}
              className={`${
                activeView === 'manage' 
                  ? 'bg-white text-blue-600 hover:bg-gray-100' 
                  : 'text-white border-white/30 hover:bg-white/10'
              }`}
            >
              Manage Files
            </Button>
          </Badge>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;