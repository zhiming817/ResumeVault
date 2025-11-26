'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '@/app/components/layout/PageLayout';

// 动态导入 Walrus 相关功能，禁用 SSR
const WalrusTestContent = dynamic(
  () => import('@/app/components/WalrusTestContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-teal-600 text-lg">加载中...</div>
        </div>
      </div>
    )
  }
);

export default function WalrusTest() {
  return (
    <PageLayout>
      <WalrusTestContent />
    </PageLayout>
  );
}
