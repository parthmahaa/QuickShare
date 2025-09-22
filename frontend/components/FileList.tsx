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
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">
        Selected Files ({formatFileSize(totalSize)})
      </h3>
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