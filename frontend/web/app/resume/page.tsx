'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div
        className="fixed inset-0 z-0 animate-[pan_60s_linear_infinite]"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: '120%',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-purple-900/60 via-indigo-800/50 to-violet-900/60" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
          <div
            className={`text-center max-w-5xl mx-auto transition-all duration-1000 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-300 via-yellow-300 to-red-300 text-transparent bg-clip-text drop-shadow-[0_4px_20px_rgba(255,165,0,0.8)]">
              ResumeVault
            </h1>

            <p className="text-2xl md:text-4xl font-bold mb-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
              Own Your Career Data, Earn From Every View
            </p>

            <p className="text-xl md:text-2xl mb-12 text-white max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] [text-shadow:_1px_1px_3px_rgb(0_0_0_/_90%)] leading-relaxed">
              A Web3 decentralized job platform where job seekers control their encrypted resumes
              and earn micropayments when recruiters unlock them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/resume/create">
                <button className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg shadow-2xl transform hover:scale-105 transition-all flex items-center gap-2">
                  Create Your Resume
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </Link>
              <Link href="/resume/browse">
                <button className="px-8 py-4 text-lg font-bold bg-white/90 hover:bg-white text-gray-900 rounded-lg shadow-xl transform hover:scale-105 transition-all border-2 border-white">
                  Browse Talent
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
