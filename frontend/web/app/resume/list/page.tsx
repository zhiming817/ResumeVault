'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import DescriptionIcon from '@mui/icons-material/Description';
import PageLayout from '@/app/components/layout/PageLayout';
import { ResumeMetadata } from '@/app/lib/types';

export default function ResumeList() {
  const router = useRouter();
  const { address } = useAccount();
  const [resumes, setResumes] = useState<ResumeMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      fetchResumes();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const fetchResumes = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBaseUrl}/api/resumes/my/${address}`);
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

  if (!address) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Typography variant="h5" color="text.secondary">
                请先连接钱包
              </Typography>
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
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              我的简历
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理您保存的所有简历
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => router.push('/resume/create')}
            sx={{ textTransform: 'none' }}
          >
            创建新简历
          </Button>
        </Box>

        {/* Content */}
        {isLoading ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <CircularProgress size={48} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                加载中...
              </Typography>
            </CardContent>
          </Card>
        ) : error ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={fetchResumes}>
                重试
              </Button>
            </CardContent>
          </Card>
        ) : resumes.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <DescriptionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                还没有简历
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/resume/create')}
                sx={{ mt: 2, textTransform: 'none' }}
              >
                创建第一份简历
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Typography variant="h6" component="h3" fontWeight="bold" sx={{ flex: 1 }}>
                        {resume.title || resume.name || '未命名简历'}
                      </Typography>
                      {resume.encrypted && (
                        <Chip
                          icon={<LockIcon />}
                          label="加密"
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>

                    {/* Summary */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {resume.summary || '暂无简介'}
                    </Typography>

                    {/* Meta */}
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                      <Typography variant="caption" display="block">
                        创建时间: {formatDate(resume.created_at || resume.createdAt)}
                      </Typography>
                      <Typography variant="caption" display="block">
                        更新时间: {formatDate(resume.updated_at || resume.updatedAt)}
                      </Typography>
                      {(resume.blob_id || resume.blobId) && (
                        <Tooltip title={resume.blob_id || resume.blobId}>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{
                              fontFamily: 'monospace',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Blob ID: {(resume.blob_id || resume.blobId)?.substring(0, 20)}...
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleView(resume)}
                      sx={{ flex: 1, mr: 1, textTransform: 'none' }}
                    >
                      查看
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(resume.id)}
                      sx={{
                        border: 1,
                        borderColor: 'error.main',
                        '&:hover': { bgcolor: 'error.main', color: 'white' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
            ))}
          </Box>
        )}
      </Container>
    </PageLayout>
  );
}
