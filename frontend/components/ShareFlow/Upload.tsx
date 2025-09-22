// src/components/ShareFlow/UploadZone.tsx

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { formatFileSize } from "@utils/formatFileSize";

const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files) {
      onFileSelect(e.dataTransfer.files);
    }
  }, [onFileSelect]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragOver
          ? "border-blue-400 bg-blue-900/20"
          : "border-gray-600 hover:border-gray-500"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto mb-4 text-gray-400" size={48} />
      <h3 className="text-xl font-semibold text-white mb-2">
        Drop files here or click to browse
      </h3>
      <p className="text-gray-400 mb-4">
        Maximum total size: {formatFileSize(MAX_TOTAL_SIZE)}
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Choose Files
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}