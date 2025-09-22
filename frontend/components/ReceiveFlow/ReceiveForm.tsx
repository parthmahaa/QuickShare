// src/components/ReceiveFlow/ReceiveForm.tsx

import { ChangeEvent } from "react";
import { AlertCircle, Download, Key } from "lucide-react";

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
    <div className="text-center">
      <Download className="mx-auto mb-4 text-blue-400" size={64} />
      <h2 className="text-2xl font-bold text-white mb-2">Receive Files</h2>
      <p className="text-gray-300 mb-6">Enter a share code or paste the link to download files.</p>

      <div className="max-w-md mx-auto space-y-4">
        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2"><Key className="inline w-4 h-4 mr-1" />6-Digit Code</label>
          <input
            type="text"
            value={receiveInput.length <= 6 && /^\d*$/.test(receiveInput) ? receiveInput : ""}
            onChange={handleCodeChange}
            placeholder="123456"
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white text-center text-lg font-mono tracking-widest"
            maxLength={6}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
          <label className="block text-sm font-medium text-gray-300 mb-2">Share Link</label>
          <input
            type="text"
            value={receiveInput.includes("http") || receiveInput.includes("?code=") ? receiveInput : ""}
            onChange={handleLinkChange}
            placeholder="Paste share link here..."
            className="w-full p-3 border border-gray-600 rounded bg-gray-800 text-white text-sm"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 text-red-300 rounded-lg flex items-center gap-2 border border-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={!receiveInput.trim() || isValidatingCode}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isValidatingCode ? "Validating..." : "Get Files"}
        </button>
      </div>
    </div>
  );
}