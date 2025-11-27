'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import LockIcon from '@mui/icons-material/Lock';
import PageLayout from '@/app/components/layout/PageLayout';
import { API_BASE_URL } from '@/app/lib/config/api.config';
import { ResumeMetadata, ResumeData } from '@/app/lib/types';
import { useAccount } from 'wagmi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResumeView({ params }: PageProps) {
  const router = useRouter();
  const { address } = useAccount();
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ResumeMetadata | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => {
      setResumeId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (address && resumeId) {
      fetchMetadata(resumeId);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, resumeId]);

  const fetchMetadata = async (id: string) => {
    if (!address) {
      setIsLoading(false);
      setError('请先连接钱包');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/resumes/${id}/${address}`);
      if (!response.ok) {
        throw new Error('Resume not found');
      }

      const data = await response.json();
      console.log('Fetched resume metadata:', data);
      
      // 处理demo格式的响应 { success: true, data: {} }
      if (data.success) {
        setMetadata(data.data || null);
        
        // 尝试从 localStorage 获取加密密钥
        if (data.data?.encrypted) {
          const savedKeys = JSON.parse(localStorage.getItem('resumeKeys') || '{}');
          if (savedKeys[data.data.blobId]) {
            setEncryptionKey(savedKeys[data.data.blobId]);
          }
        }
      } else {
        throw new Error(data.error || '获取简历信息失败');
      }
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
      setError(err instanceof Error ? err.message : '加载简历信息失败');
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

    const blobId = metadata.blobId || metadata.blob_id;
    if (!blobId) {
      alert('简历数据缺失');
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      // 动态导入 resume service
      const { downloadResume } = await import('@/app/lib/services/resume.service');

      const data = await downloadResume(
        blobId,
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <CircularProgress size={48} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                加载中...
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </PageLayout>
    );
  }

  if (error && !metadata) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button
                variant="contained"
                onClick={() => router.back()}
                startIcon={<ArrowBackIcon />}
              >
                返回
              </Button>
            </CardContent>
          </Card>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2, textTransform: 'none' }}
          >
            返回
          </Button>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            查看简历
          </Typography>
          <Typography variant="body1" color="text.secondary">
            下载并预览简历内容
          </Typography>
        </Box>

        {metadata && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Metadata Card */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                  <Typography variant="h4" component="h2" fontWeight="bold">
                    {metadata.title || metadata.name || '未命名简历'}
                  </Typography>
                  {metadata.encrypted && (
                    <Chip
                      icon={<LockIcon />}
                      label="加密简历"
                      color="success"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      简介
                    </Typography>
                    <Typography variant="body1">
                      {metadata.summary || '暂无简介'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Blob ID
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                      }}
                    >
                      {metadata.blobId || metadata.blob_id || '-'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        创建时间
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(metadata.createdAt || metadata.created_at)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        更新时间
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(metadata.updatedAt || metadata.updated_at)}
                      </Typography>
                    </Box>
                  </Box>

                  {metadata.encrypted && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        加密密钥 *
                      </Typography>
                      <Box
                        component="input"
                        type="text"
                        value={encryptionKey}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEncryptionKey(e.target.value)}
                        placeholder="请输入加密密钥"
                        sx={{
                          width: '100%',
                          p: 1.5,
                          border: 1,
                          borderColor: 'grey.300',
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          '&:focus': {
                            outline: 'none',
                            borderColor: 'primary.main',
                            boxShadow: 1,
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {encryptionKey ? '✓ 已找到保存的密钥' : '需要密钥才能解密简历内容'}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleDownload}
                  disabled={isDownloading}
                  startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                  sx={{ mt: 3, textTransform: 'none' }}
                >
                  {isDownloading ? '下载中...' : '下载并预览简历'}
                </Button>
              </CardContent>
            </Card>

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
          </Box>
        )}
      </Container>
    </PageLayout>
  );
}
