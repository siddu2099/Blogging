import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Master Blog Platform',
  description: 'Built with Next.js and MERN',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}