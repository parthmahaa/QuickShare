import { Github, Twitter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="relative z-10 w-full px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* <Link href="/" className="flex items-center">
              <Image
                src="/logo2.png"
                alt="QuickShare"
                width={36}
                height={36}
                priority
                className="rounded-lg"
                style={{
                  objectFit: 'contain',
                  filter: 'brightness(0) invert(1)' // Makes logo white
                }}
              />
          </Link> */}
          <div className="ml-3">
            <span className="text-2xl font-bold text-white">QuickShare</span>
          </div>
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