// src/components/ReceiveFlow/DownloadDetails.tsx

import { DownloadData } from "../../types/index";
import { formatFileSize } from "@utils/formatFileSize";
import { ArrowLeft, CheckCircle, Clock, File as FileIcon } from "lucide-react";

interface DownloadDetailsProps {
  downloadData: DownloadData;
  onBack: () => void;
  onReset: () => void;
}

export default function DownloadDetails({ downloadData, onBack, onReset }: DownloadDetailsProps) {
  return (
    <div className="text-center">
      <CheckCircle className="mx-auto mb-4 text-green-400" size={64} />
      <h2 className="text-2xl font-bold text-white mb-2">Files Found!</h2>
      <p className="text-gray-300 mb-6">Download the files below. Links expire soon.</p>

      {/* File List */}
      <div className="mb-6 text-left">
        <h3 className="text-lg font-semibold text-white mb-3">Available Files</h3>
        <div className="space-y-2">
          {downloadData.files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <FileIcon className="text-gray-400" size={24} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{file.name}</p>
                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
              </div>
              <a href={file.url} download className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Expiry Info */}
      <div className="bg-yellow-900/50 p-4 rounded-lg mb-6 border border-yellow-700 flex items-center gap-2 text-yellow-300">
        <Clock size={20} />
        <span className="text-sm">Expires: {downloadData.expiryTime.toLocaleString()}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <button onClick={onBack} className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
          <ArrowLeft className="inline w-4 h-4 mr-2" />
          Back
        </button>
        <button onClick={onReset} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Get More Files
        </button>
      </div>
    </div>
  );
}