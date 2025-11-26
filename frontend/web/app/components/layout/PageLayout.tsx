'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PageLayout Component
 * Wraps pages with Navbar, Footer, and background for non-home pages
 */
export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/resume' || pathname === '/';

  if (isHomePage) {
    // Home page handles its own layout
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Image for non-home pages */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Overlay for better content readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900/70 via-purple-900/70 to-indigo-900/70" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-[calc(100vh-200px)]">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
