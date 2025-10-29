import type { FileData } from "../../types/index";
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
    <div className="space-y-5">
      <UploadZone onFileSelect={onFileSelect} />

      {files.length > 0 && (
        <FileList files={files} onRemoveFile={onRemoveFile} />
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out" 
              style={{ width: `${uploadProgress}%` }} 
            />
          </div>
        </div>
      )}

      <button
        onClick={onUpload}
        disabled={files.length === 0 || isUploading || !!error}
        className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
      >
        {isUploading ? "Uploading..." : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
      </button>
    </div>
  );
}