import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuickShare',
  description: 'Secure file sharing app',
};
//neue montreal
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        // google tag
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5CCNEBZ69M"></script>
        <script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5CCNEBZ69M');
        `}
        </script>

      </head>
      <body className="min-h-screen w-full relative bg-black flex flex-col">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
          }}
        />
        <div className="flex-1 relative z-10">
          {children}
        </div>
        <footer className="relative z-10 border-t border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <p className="text-center text-xs text-gray-500">
              © 2025 QuickShare. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}