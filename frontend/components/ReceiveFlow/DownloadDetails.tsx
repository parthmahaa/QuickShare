import type { DownloadData } from "../../types/index";
import { formatFileSize } from "@utils/formatFileSize";
import { ArrowLeft, CheckCircle2, Clock, Download } from "lucide-react";

interface DownloadDetailsProps {
  downloadData: DownloadData;
  onBack: () => void;
  onReset: () => void;
}

export default function DownloadDetails({ downloadData, onBack, onReset }: DownloadDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />
          <CheckCircle2 className="relative text-green-400" size={56} strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-white">Files Ready</h2>
        <p className="text-sm text-gray-400">Download your files below</p>
      </div>

      {/* File List */}
      <div className="space-y-2">
        {downloadData.files.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center gap-3 p-3 bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <a 
              href={file.url} 
              download 
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-green-600/10 hover:bg-green-600/20 text-green-400 text-xs font-medium rounded-md transition-colors"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        ))}
      </div>

      {/* Expiry Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <Clock size={16} className="text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300">Expires {downloadData.expiryTime.toLocaleString()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={onBack} 
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800/50 hover:bg-gray-800/70 text-gray-300 text-sm font-medium rounded-lg transition-colors border border-gray-700/50"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button 
          onClick={onReset} 
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Get More Files
        </button>
      </div>
    </div>
  );
}