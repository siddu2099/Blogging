'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">DevBlog</Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {user ? (
            // If User IS logged in:
            <>
              <span className="text-gray-500 text-sm hidden sm:inline">Hi, {user.name}</span>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium">
                Logout
              </button>
            </>
          ) : (
            // If User is NOT logged in:
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}