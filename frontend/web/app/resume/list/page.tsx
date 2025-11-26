'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import PageLayout from '@/app/components/layout/PageLayout';
import { ResumeMetadata } from '@/app/lib/types';

export default function ResumeList() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentAccount) {
      fetchResumes();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const fetchResumes = async () => {
    if (!currentAccount) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/resumes/my/${currentAccount.address}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }

      const data = await response.json();
      console.log('Fetched resumes:', data);
      
      // 处理demo格式的响应 { success: true, data: [] }
      if (data.success) {
        setResumes(data.data || []);
      } else {
        throw new Error(data.error || '获取简历列表失败');
      }
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setError(err instanceof Error ? err.message : '加载简历列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这份简历吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      // 重新加载列表
      fetchResumes();
      alert('简历已删除');
    } catch (err) {
      console.error('Failed to delete resume:', err);
      alert('删除简历失败');
    }
  };

  const handleView = (resume: ResumeMetadata) => {
    // 导航到查看页面
    router.push(`/resume/view/${resume.id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '未知';
    }
  };

  if (!currentAccount) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-gray-600">请先连接钱包</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">我的简历</h1>
            <p className="text-white/80">管理您保存的所有简历</p>
          </div>
          <button
            onClick={() => router.push('/resume/create')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            创建新简历
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-red-600">{error}</p>
            <button
              onClick={fetchResumes}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              重试
            </button>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl text-gray-600 mb-4">还没有简历</p>
            <button
              onClick={() => router.push('/resume/create')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              创建第一份简历
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {resume.title || resume.name || '未命名简历'}
                  </h3>
                  {resume.encrypted && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      🔐 加密
                    </span>
                  )}
                </div>

                {/* Summary */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {resume.summary || '暂无简介'}
                </p>

                {/* Meta */}
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <div>创建时间: {formatDate(resume.created_at || resume.createdAt)}</div>
                  <div>更新时间: {formatDate(resume.updated_at || resume.updatedAt)}</div>
                  {(resume.blob_id || resume.blobId) && (
                    <div className="font-mono text-xs truncate" title={resume.blob_id || resume.blobId}>
                      Blob ID: {(resume.blob_id || resume.blobId)?.substring(0, 20)}...
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(resume)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    查看
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
