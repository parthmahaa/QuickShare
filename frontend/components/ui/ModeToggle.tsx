import type { Mode } from "../../types/index";

interface ModeToggleProps {
  mode: Mode;
  onSwitch: (newMode: Mode) => void;
}

export default function ModeToggle({ mode, onSwitch }: ModeToggleProps) {
  return (
    <div className="flex justify-center mt-8 mb-6">
      <div className="inline-flex bg-gray-800/40 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
        <button
          onClick={() => onSwitch("share")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            mode === "share"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          Share Files
        </button>
        <button
          onClick={() => onSwitch("receive")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${
            mode === "receive"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-gray-400 hover:text-white hover:bg-gray-700/30"
          }`}
        >
          Receive Files
        </button>
      </div>
    </div>
  );
}