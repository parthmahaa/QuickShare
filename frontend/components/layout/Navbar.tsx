import { Share, Github, Twitter } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="relative z-10 w-full px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            {/* <Share className="w-6 h-6 text-blue-400" /> */}
          </div>
          <span className="text-2xl font-bold text-white">QuickShare</span>
        </div>
        
        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/parthmahaa/QuickShare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </nav>
  );
}