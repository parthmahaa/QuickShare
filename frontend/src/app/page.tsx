// app/page.tsx
'use client';

import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from '../Components/Header'; // Update path if needed
import FileUploader from '../Components/FileUploader';
import FileManager from '../Components/FileManager';
import { FileData } from '../types/types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#9ecb00',
      light: '#a3d000',
      dark: '#8bb500',
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
        },
      },
    },
  },
});

export default function Home() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'manage'>('upload');

  const handleFileUpload = (newFiles: FileData[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpdateFile = (id: string, updates: Partial<FileData>) => {
    setFiles(prev => prev.map(file =>
      file.id === id ? { ...file, ...updates } : file
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-lime-400 to-black relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-gray-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(156,203,0,0.1),_transparent_50%)]"></div>

        <div className="relative z-10">
          <Header
            activeView={activeView}
            onViewChange={setActiveView}
            fileCount={files.length}
          />

          <main className="container mx-auto px-4 py-8">
            {activeView === 'upload' ? (
              <FileUploader onFileUpload={handleFileUpload} />
            ) : (
              <FileManager
                files={files}
                onDeleteFile={handleDeleteFile}
                onUpdateFile={handleUpdateFile}
              />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
