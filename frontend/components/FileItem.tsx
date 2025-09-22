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
    <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
      {fileData.preview ? (
        <img
          src={fileData.preview}
          alt={fileData.name}
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <FileIcon className="text-gray-400" size={24} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {fileData.name}
        </p>
        <p className="text-xs text-gray-400">
          {formatFileSize(fileData.size)}
        </p>
      </div>
      <button
        onClick={() => onRemove(fileData.id)}
        className="text-red-400 hover:text-red-300 p-1"
      >
        <X size={16} />
      </button>
    </div>
  );
}