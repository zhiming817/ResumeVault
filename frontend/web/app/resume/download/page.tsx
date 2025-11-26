'use client';

import React, { useState } from 'react';
import PageLayout from '@/app/components/layout/PageLayout';
import { ResumeData } from '@/app/lib/types';

export default function ResumeDownload() {
  const [blobId, setBlobId] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [useEncryption, setUseEncryption] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!blobId) {
      alert('请输入 Blob ID');
      return;
    }

    if (useEncryption && !encryptionKey) {
      alert('请输入加密密钥');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // 动态导入 resume service
      const { downloadResume } = await import('@/app/lib/services/resume.service');

      const data = await downloadResume(
        blobId,
        useEncryption ? encryptionKey : undefined
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

  const handleReset = () => {
    setBlobId('');
    setEncryptionKey('');
    setResumeData(null);
    setError(null);
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">下载简历</h1>
          <p className="text-white/80">输入 Blob ID 和加密密钥下载简历</p>
        </div>

        <div className="space-y-6">
          {/* Input Card */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">输入信息</h2>

            <div className="space-y-4">
              {/* Encryption Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="useEncryption"
                  checked={useEncryption}
                  onChange={(e) => setUseEncryption(e.target.checked)}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="useEncryption" className="text-lg font-medium text-gray-900">
                  简历已加密
                </label>
              </div>

              {/* Blob ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blob ID *
                </label>
                <input
                  type="text"
                  value={blobId}
                  onChange={(e) => setBlobId(e.target.value)}
                  placeholder="输入 Walrus Blob ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm text-black"
                />
              </div>

              {/* Encryption Key */}
              {useEncryption && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    加密密钥 *
                  </label>
                  <input
                    type="text"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    placeholder="输入加密密钥"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 font-mono text-sm text-black"
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || !blobId}
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isDownloading ? '下载中...' : '📥 下载简历'}
                </button>
                {resumeData && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>
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
      </div>
    </PageLayout>
  );
}
