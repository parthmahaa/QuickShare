import { FileData } from "../types/index";
import { formatFileSize } from "@utils/formatFileSize";
import FileItem from "./FileItem";

interface FileListProps {
  files: FileData[];
  onRemoveFile: (id: string) => void;
}

export default function FileList({ files, onRemoveFile }: FileListProps) {
  const totalSize = files.reduce((total, file) => total + file.size, 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">
          Selected Files
        </h3>
        <span className="text-xs text-gray-500">{formatFileSize(totalSize)}</span>
      </div>
      <div className="space-y-2">
        {files.map((fileData) => (
          <FileItem
            key={fileData.id}
            fileData={fileData}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </div>
  );
}