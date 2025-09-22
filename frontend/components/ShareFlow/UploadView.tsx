// src/components/ShareFlow/UploadView.tsx

import { FileData } from "../../types/index";
import UploadZone from "./Upload";
import FileList from "../FileList";
import { AlertCircle } from "lucide-react";

interface UploadViewProps {
  files: FileData[];
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  onFileSelect: (files: FileList) => void;
  onRemoveFile: (id: string) => void;
  onUpload: () => void;
}

export default function UploadView({
  files,
  isUploading,
  uploadProgress,
  error,
  onFileSelect,
  onRemoveFile,
  onUpload,
}: UploadViewProps) {
  return (
    <>
      <div className="mb-6">
        <UploadZone onFileSelect={onFileSelect} />
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <FileList files={files} onRemoveFile={onRemoveFile} />
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg flex items-center gap-2 border border-red-700">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Uploading files...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={onUpload}
          disabled={files.length === 0 || isUploading || !!error}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading..." : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
        </button>
      </div>
    </>
  );
}