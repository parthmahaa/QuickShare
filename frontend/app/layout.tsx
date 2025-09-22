import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@components/layout/Navbar';

export const metadata: Metadata = {
  title: 'QuickShare',
  description: 'Secure file sharing app',
};
//neue montreal
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full relative bg-black ">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226, 232, 240, 0.15), transparent 70%), #000000",
          }}
        />
        {children}
      </body>
    </html>
  );
}