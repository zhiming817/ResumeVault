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
      {/* Modern gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <div className="min-h-[calc(100vh-200px)]">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
