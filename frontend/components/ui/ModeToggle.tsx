import type { Mode } from "../../types/index";

interface ModeToggleProps {
  mode: Mode;
  onSwitch: (newMode: Mode) => void;
}

export default function ModeToggle({ mode, onSwitch }: ModeToggleProps) {
  return (
    <div className="flex justify-center mt-10 mb-8">
      <div className="bg-gray-800/50 gap rounded-lg p-1 backdrop-blur-sm border border-gray-700">
        <button
          onClick={() => onSwitch("share")}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            mode === "share"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Share Files
        </button>
        <button
          onClick={() => onSwitch("receive")}
          className={`px-6 py-2 rounded-md font-medium transition-all ${
            mode === "receive"
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-300 hover:text-white hover:bg-gray-700/50"
          }`}
        >
          Receive Files
        </button>
      </div>
    </div>
  );
}