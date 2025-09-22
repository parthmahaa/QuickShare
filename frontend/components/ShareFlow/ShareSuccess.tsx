import { ShareData } from "../../types/index";
import { Copy } from "lucide-react";

interface ShareSuccessProps {
  shareData: ShareData;
  onCopy: (text: string, type: string) => void;
  onReset: () => void;
}

export default function ShareSuccess({ shareData, onCopy, onReset }: ShareSuccessProps) {
  // Derive expiry time client-side based on app.file.expiry.hours (24 hours by default)
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

  return (
    <div className="text-center">
      <svg
        className="mx-auto mb-4 text-green-400"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2l4-4" />
      </svg>
      <h2 className="text-2xl font-bold text-white mb-2">Files Uploaded!</h2>
      <p className="text-gray-300 mb-6">Your file is ready to share. The link and code expire in 24 hours.</p>

      {/* Share Actions */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareData.shareLink}
              readOnly
              className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm"
            />
            <button
              onClick={() => onCopy(shareData.shareLink, "Link")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">Share Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareData.shareCode}
              readOnly
              className="flex-1 p-2 border border-gray-600 rounded bg-gray-800 text-white text-sm font-mono text-center text-lg"
            />
            <button
              onClick={() => onCopy(shareData.shareCode, "Code")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Copy size={16} />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Share this code with your recipient to download the file.</p>
        </div>
      </div>

      {/* Expiry Info & Reset */}
      <div className="bg-yellow-900/50 p-4 rounded-lg mb-6 border border-yellow-700 flex items-center gap-2 text-yellow-300">
        <svg
          className="text-yellow-300"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-sm">Expires: {expiryTime.toLocaleString()}</span>
      </div>
      <button
        onClick={onReset}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Upload More Files
      </button>
    </div>
  );
}