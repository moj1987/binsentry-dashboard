'use client';

import { useAuth } from '../components/auth/AuthProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const { user, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Auth */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <Image 
              src="/IMG_5020.PNG" 
              alt="BinSentry Logo" 
              width={296}
              height={296}
              className="mx-auto mb-6 rounded-lg shadow-lg"
            />
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              BinSentry Dashboard
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-powered feed management system with real-time monitoring, 
              sensors, and data analytics for large-scale agricultural operations.
            </p>
            
            {/* Main CTA Button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-lg"
            >
              📊 Go to Dashboard
            </Link>

             {/* Auth Button */}
            <div>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Welcome, {user.username}</span>
                  <button
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔐 Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}