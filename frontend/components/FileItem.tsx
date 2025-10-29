// src/components/FileItem.tsx

import { FileData } from "../types/index";
import { formatFileSize } from "@utils/formatFileSize";
import { File as FileIcon, X } from "lucide-react";

interface FileItemProps {
  fileData: FileData;
  onRemove: (fileId: string) => void;
}

export default function FileItem({ fileData, onRemove }: FileItemProps) {
  return (
    <div className="group flex items-center gap-3 p-2.5 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all">
      {fileData.preview ? (
        <img
          src={fileData.preview}
          alt={fileData.name}
          className="w-9 h-9 object-cover rounded"
        />
      ) : (
        <div className="w-9 h-9 flex items-center justify-center bg-gray-700/50 rounded">
          <FileIcon className="text-gray-400" size={18} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {fileData.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(fileData.size)}
        </p>
      </div>
      <button
        onClick={() => onRemove(fileData.id)}
        className="shrink-0 p-1.5 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove file"
      >
        <X size={16} />
      </button>
    </div>
  );
}