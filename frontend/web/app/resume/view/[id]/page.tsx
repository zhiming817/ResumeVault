'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/app/components/layout/PageLayout';
import { ResumeMetadata, ResumeData } from '@/app/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResumeView({ params }: PageProps) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<ResumeMetadata | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      fetchMetadata(p.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMetadata = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (!response.ok) {
        throw new Error('Resume not found');
      }

      const data = await response.json();
      setMetadata(data);

      // 尝试从 localStorage 获取加密密钥
      if (data.encrypted) {
        const savedKeys = JSON.parse(localStorage.getItem('resumeKeys') || '{}');
        if (savedKeys[data.blobId]) {
          setEncryptionKey(savedKeys[data.blobId]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
      setError('加载简历信息失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!metadata) return;

    if (metadata.encrypted && !encryptionKey) {
      alert('请输入加密密钥');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // 动态导入 resume service
      const { downloadResume } = await import('@/app/lib/services/resume.service');

      const data = await downloadResume(
        metadata.blobId,
        metadata.encrypted ? encryptionKey : undefined
      );

      setResumeData(data);
      alert('简历下载成功！');
    } catch (err) {
      console.error('Failed to download resume:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`下载简历失败: ${message}`);
      alert(`下载简历失败: ${message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error && !metadata) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              返回
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 text-white hover:text-white/80 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">查看简历</h1>
          <p className="text-white/80">下载并预览简历内容</p>
        </div>

        {metadata && (
          <div className="space-y-6">
            {/* Metadata Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{metadata.title}</h2>
                {metadata.encrypted && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    🔐 加密简历
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
                  <p className="text-gray-600">{metadata.summary}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blob ID</label>
                  <p className="font-mono text-sm text-gray-600 break-all">{metadata.blobId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">创建时间</label>
                    <p className="text-gray-600">{formatDate(metadata.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">更新时间</label>
                    <p className="text-gray-600">{formatDate(metadata.updatedAt)}</p>
                  </div>
                </div>

                {metadata.encrypted && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      加密密钥 *
                    </label>
                    <input
                      type="text"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                      placeholder="请输入加密密钥"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm text-black"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {encryptionKey ? '✓ 已找到保存的密钥' : '需要密钥才能解密简历内容'}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isDownloading ? '下载中...' : '📥 下载并预览简历'}
              </button>
            </div>

            {/* Resume Preview */}
            {resumeData && (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">简历预览</h2>

                {/* Personal Info */}
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>👤</span>
                    <span>个人信息</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">姓名:</span>
                      <p className="font-medium">{resumeData.personal.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">邮箱:</span>
                      <p className="font-medium">{resumeData.personal.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">电话:</span>
                      <p className="font-medium">{resumeData.personal.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">微信:</span>
                      <p className="font-medium">{resumeData.personal.wechat}</p>
                    </div>
                  </div>
                </section>

                {/* Skills */}
                {resumeData.skills && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>⭐</span>
                      <span>专业技能</span>
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{resumeData.skills}</p>
                  </section>
                )}

                {/* Desired Position */}
                {resumeData.desiredPosition && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>💼</span>
                      <span>期望职位</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">职位:</span>
                        <p className="font-medium">{resumeData.desiredPosition.position}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">行业:</span>
                        <p className="font-medium">{resumeData.desiredPosition.industry}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">城市:</span>
                        <p className="font-medium">{resumeData.desiredPosition.city}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">薪资:</span>
                        <p className="font-medium">
                          {resumeData.desiredPosition.salaryMin} - {resumeData.desiredPosition.salaryMax}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Work Experience */}
                {resumeData.workExperience && resumeData.workExperience.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>💻</span>
                      <span>工作经历</span>
                    </h3>
                    <div className="space-y-4">
                      {resumeData.workExperience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-orange-500 pl-4">
                          <h4 className="font-bold text-gray-900">{exp.position}</h4>
                          <p className="text-gray-600">{exp.company} · {exp.industry}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎓</span>
                      <span>教育经历</span>
                    </h3>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-bold text-gray-900">{edu.school}</h4>
                          <p className="text-gray-600">{edu.major} · {edu.degree}</p>
                          <p className="text-sm text-gray-500">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Project Experience */}
                {resumeData.projectExperience && resumeData.projectExperience.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📁</span>
                      <span>项目经验</span>
                    </h3>
                    <div className="space-y-4">
                      {resumeData.projectExperience.map((proj, index) => (
                        <div key={index} className="border-l-4 border-green-500 pl-4">
                          <h4 className="font-bold text-gray-900">{proj.name}</h4>
                          <p className="text-gray-600">{proj.role}</p>
                          <p className="text-sm text-gray-500 mb-2">
                            {proj.startDate} - {proj.current ? '至今' : proj.endDate}
                          </p>
                          <p className="text-gray-700 whitespace-pre-wrap">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certificates */}
                {resumeData.certificates && resumeData.certificates.length > 0 && (
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📜</span>
                      <span>证书</span>
                    </h3>
                    <div className="space-y-2">
                      {resumeData.certificates.map((cert, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.issuer}</p>
                          </div>
                          <p className="text-sm text-gray-500">{cert.issueDate}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
