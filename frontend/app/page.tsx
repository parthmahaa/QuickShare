// src/app/page.tsx
"use client";

import { useState, useCallback } from "react";
import Navbar from "@components/layout/Navbar";
import ModeToggle from "@components/ui/ModeToggle";
import Notification from "@components/ui/Notification";
import UploadView from "@components/ShareFlow/UploadView";
import ShareSuccess from "@components/ShareFlow/ShareSuccess";
import ReceiveForm from "@components/ReceiveFlow/ReceiveForm";
import DownloadDetails from "@components/ReceiveFlow/DownloadDetails";

import {
  Mode,
  FileData,
  UploadedFile,
  ShareData,
  DownloadData,
  Notification as NotificationType,
  NotificationType as NotifTypeEnum,
} from "../types/index";
import { formatFileSize } from "@utils/formatFileSize";
import useUpload from "@utils/useUpload"; // Assuming this custom hook is typed

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

export default function FileSharePage() {
  const [mode, setMode] = useState<Mode>("share");
  const [files, setFiles] = useState<FileData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [receiveInput, setReceiveInput] = useState<string>("");
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState<boolean>(false);
  const [upload] = useUpload();

  const showNotification = useCallback((message: string, type: NotifTypeEnum = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  const getTotalSize = useCallback((): number => {
    return files.reduce((total, file) => total + file.size, 0);
  }, [files]);

  const validateAndSetFiles = useCallback((selectedFiles: FileList) => {
    const currentSize = getTotalSize();
    const additionalSize = Array.from(selectedFiles).reduce((total, f) => total + f.size, 0);

    if (currentSize + additionalSize > MAX_TOTAL_SIZE) {
      setError(`Total file size cannot exceed ${formatFileSize(MAX_TOTAL_SIZE)}`);
      return;
    }
    setError(null);

    const newFiles: FileData[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, [getTotalSize]);

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
    setError(null);
  }, []);

  const uploadFiles = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    try {
      const filesToUpload = files.map((fileData) => fileData.file);

      const result = await upload({
        files: filesToUpload,
        onUploadProgress: setUploadProgress,
      });

      if (result.error) throw new Error(result.error);
      
      setShareData({
        shareId: result.shareId,
        shareLink: result.shareLink,
        shareCode: result.shareCode,
      });
      showNotification("Files uploaded successfully!", "success");

    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      showNotification("Upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };


  const copyToClipboard = useCallback(async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showNotification(`${type} copied to clipboard!`, "success");
    } catch (err) {
      showNotification("Failed to copy to clipboard", "error");
    }
  }, [showNotification]);

   const handleReceiveSubmit = useCallback(async () => {
    if (!receiveInput.trim()) return;
    setIsValidatingCode(true);
    setError(null);
    try {
      let shareId = "";
      let code = "";
      if (receiveInput.includes("?code=")) {
        const url = new URL(receiveInput);
        shareId = url.pathname.split("/").pop() || "";
        code = url.searchParams.get("code") || "";
      } else if (/^\d{6}$/.test(receiveInput.trim())) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/validate-code/${receiveInput.trim()}`);
        if (!response.ok) throw new Error(await response.text());
        shareId = await response.text();
        code = receiveInput.trim();
      } else {
        throw new Error("Please enter a valid 6-digit code or share link");
      }
      if (!shareId) {
        throw new Error("Invalid share ID or code.");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/download/${shareId}?code=${code}`,{
        headers: {
          'X-Client-Request': 'true'
        }
      });
      if (!response.ok) throw new Error(await response.text());
      
      const filesData = await response.json();

      setDownloadData({
        code,
        files: filesData.map((file: any) => ({
          name: file.name,
          size: file.size,
          type: '', 
          url: file.url,
        })),
        expiryTime: new Date(Date.now() + 23 * 60 * 60 * 1000), 
      });

      showNotification("Files found!", "success");
    } catch (err: any) {
      setError(err.message);
      showNotification("Failed to retrieve files", "error");
    } finally {
      setIsValidatingCode(false);
    }
  }, [receiveInput, showNotification]);


  const resetShareMode = () => {
    setFiles([]);
    setShareData(null);
    setError(null);
    setUploadProgress(0);
  };

  const resetReceiveMode = () => {
    setDownloadData(null);
    setError(null);
    setReceiveInput("");
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    resetShareMode();
    resetReceiveMode();
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <ModeToggle mode={mode} onSwitch={switchMode} />
          {notification && <Notification notification={notification} />}
          <div className="bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700 p-6">
            {mode === "share" ? (
              shareData ? (
                <ShareSuccess shareData={shareData} onCopy={copyToClipboard} onReset={resetShareMode} />
              ) : (
                <UploadView
                  files={files}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  error={error}
                  onFileSelect={validateAndSetFiles}
                  onRemoveFile={removeFile}
                  onUpload={uploadFiles}
                />
              )
            ) : downloadData ? (
              <DownloadDetails downloadData={downloadData} onBack={() => setDownloadData(null)} onReset={resetReceiveMode} />
            ) : (
              <ReceiveForm
                receiveInput={receiveInput}
                isValidatingCode={isValidatingCode}
                error={error}
                onInputChange={setReceiveInput}
                onSubmit={handleReceiveSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}