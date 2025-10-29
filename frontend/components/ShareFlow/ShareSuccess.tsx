import type { ShareData } from "../../types/index";
import { Copy, CheckCircle2, Clock } from "lucide-react";

interface ShareSuccessProps {
  shareData: ShareData;
  onCopy: (text: string, type: string) => void;
  onReset: () => void;
}

export default function ShareSuccess({ shareData, onCopy, onReset }: ShareSuccessProps) {
  const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
        <h2 className="text-2xl font-semibold text-white">Ready to Share</h2>
        <p className="text-sm text-gray-400">Share the link or code below</p>
      </div>

      {/* Share Options */}
      <div className="space-y-3">
        {/* Share Link */}
        <div className="group relative bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all p-3">
          <label className="text-xs font-medium text-gray-400 mb-1.5 block">Share Link</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareData.shareLink}
              readOnly
              className="flex-1 bg-transparent text-white text-sm outline-none truncate"
            />
            <button
              onClick={() => onCopy(shareData.shareLink, "Link")}
              className="shrink-0 p-2 rounded-md bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
              aria-label="Copy link"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        {/* Share Code */}
        <div className="group relative bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all p-3">
          <label className="text-xs font-medium text-gray-400 mb-1.5 block">Share Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareData.shareCode}
              readOnly
              className="flex-1 bg-transparent text-white text-xl font-mono tracking-wider text-center outline-none"
            />
            <button
              onClick={() => onCopy(shareData.shareCode, "Code")}
              className="shrink-0 p-2 rounded-md bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-colors"
              aria-label="Copy code"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expiry Info */}
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <Clock size={16} className="text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300">Expires {expiryTime.toLocaleString()}</span>
      </div>

      {/* Action Button */}
      <button
        onClick={onReset}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Upload More Files
      </button>
    </div>
  );
}