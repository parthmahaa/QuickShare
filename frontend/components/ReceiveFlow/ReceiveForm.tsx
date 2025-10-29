import type { ChangeEvent } from "react";
import { AlertCircle, Download, Hash } from "lucide-react";

interface ReceiveFormProps {
  receiveInput: string;
  isValidatingCode: boolean;
  error: string | null;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export default function ReceiveForm({
  receiveInput,
  isValidatingCode,
  error,
  onInputChange,
  onSubmit,
}: ReceiveFormProps) {
  
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      onInputChange(value);
    }
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Download className="relative text-blue-400" size={56} strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-semibold text-white">Receive Files</h2>
        <p className="text-sm text-gray-400">Enter a code or paste the share link</p>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Code Input */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-2">
            <Hash size={14} />
            6-Digit Code
          </label>
          <input
            type="text"
            value={receiveInput.length <= 6 && /^\d*$/.test(receiveInput) ? receiveInput : ""}
            onChange={handleCodeChange}
            placeholder="123456"
            className="w-full bg-transparent text-white text-center text-2xl font-mono tracking-[0.5em] outline-none placeholder:text-gray-700"
            maxLength={6}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700/50" />
          <span className="text-xs text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gray-700/50" />
        </div>

        {/* Link Input */}
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 p-3">
          <label className="text-xs font-medium text-gray-400 mb-2 block">Share Link</label>
          <input
            type="text"
            value={receiveInput.includes("http") || receiveInput.includes("?code=") ? receiveInput : ""}
            onChange={handleLinkChange}
            placeholder="Paste share link here..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-gray-700"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          disabled={!receiveInput.trim() || isValidatingCode}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isValidatingCode ? "Validating..." : "Get Files"}
        </button>
      </div>
    </div>
  );
}