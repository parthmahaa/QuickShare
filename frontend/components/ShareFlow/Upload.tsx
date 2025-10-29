import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from "react";
import { Upload, FileUp } from "lucide-react";
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
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
        isDragOver
          ? "border-blue-500 bg-blue-500/5 scale-[1.02]"
          : "border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <FileUp className="relative text-gray-400" size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-white">
            Drop files here or click to browse
          </h3>
          <p className="text-xs text-gray-500">
            Maximum {formatFileSize(MAX_TOTAL_SIZE)}
          </p>
        </div>
      </div>
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