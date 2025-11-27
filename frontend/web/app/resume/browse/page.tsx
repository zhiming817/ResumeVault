'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Paper,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { API_BASE_URL } from '@/app/lib/config/api.config';
import PageLayout from '@/app/components/layout/PageLayout';

interface ResumeSummary {
  id: string;
  owner: string;
  name: string | null;
  skills_summary: string;
  desired_position_summary: string;
  years_of_experience: number;
  education_level: string;
  blob_id: string;
  encryption_type: 'seal' | 'simple';
  created_at: string;
  updated_at: string;
}

export default function BrowseResumes() {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load resume summaries
  useEffect(() => {
    loadResumeSummaries();
  }, []);

  const loadResumeSummaries = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiResponse = await fetch(`https://miniapp.egtoy.xyz/backend/api/resumes/summaries`);
      if (!apiResponse.ok) {
        throw new Error('Failed to fetch resumes');
      }
      const response = await apiResponse.json();

      if (response.success && response.data) {
        // 后端返回的数据结构是 { success: true, data: [...] }
        if (Array.isArray(response.data)) {
          setResumes(response.data);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(response.error || 'Failed to load resume list');
      }
    } catch (err) {
      console.error('Failed to load resume list:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = (resumeId: string) => {
    // TODO: Navigate to resume detail page
    console.log('View resume:', resumeId);
  };

  // Parse desired position summary
  const parseDesiredPosition = (summary: string) => {
    try {
      const parsed = JSON.parse(summary);
      return {
        position: parsed.position || 'Not specified',
        jobType: parsed.job_type || parsed.jobType || 'Not specified',
        city: parsed.city || 'Not specified',
        salaryMin: parsed.salary_min || parsed.salaryMin,
        salaryMax: parsed.salary_max || parsed.salaryMax,
      };
    } catch {
      return {
        position: 'Not specified',
        jobType: 'Not specified',
        city: 'Not specified',
      };
    }
  };

  // Format salary range
  const formatSalary = (min?: string, max?: string) => {
    if (!min && !max) return 'Negotiable';
    if (min && max) {
      const minK = Math.round(parseInt(min) / 1000);
      const maxK = Math.round(parseInt(max) / 1000);
      return `${minK}K - ${maxK}K`;
    }
    if (min) return `${Math.round(parseInt(min) / 1000)}K+`;
    if (max) return `Up to ${Math.round(parseInt(max) / 1000)}K`;
    return 'Negotiable';
  };

  // Loading state
  if (loading) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Stack spacing={2} alignItems="center">
              <CircularProgress size={60} />
              <Typography color="text.secondary">Loading resume list...</Typography>
            </Stack>
          </Box>
        </Container>
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Stack spacing={3} alignItems="center" maxWidth="md">
              <Typography variant="h1" fontSize="3rem">
                ⚠️
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                Loading Failed
              </Typography>
              <Typography color="text.secondary">{error}</Typography>
              <Button variant="contained" onClick={loadResumeSummaries} size="large">
                Retry
              </Button>
            </Stack>
          </Box>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Browse Resumes
        </Typography>
        <Typography color="text.secondary" variant="body1">
          Discover excellent talent
        </Typography>
      </Box>

      {/* Results Count */}
      <Box mb={3}>
        <Typography color="text.secondary">
          Found <strong>{resumes.length}</strong> matching resumes
        </Typography>
      </Box>

      {/* Resume Cards */}
      {resumes.length > 0 ? (
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
          {resumes.map((resume) => {
            const position = parseDesiredPosition(resume.desired_position_summary);
            const displayName = resume.name || 'Anonymous';

            return (
              <Card
                key={resume.id}
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    elevation: 8,
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 3,
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        width: 56,
                        height: 56,
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {displayName}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {position.position}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} flexWrap="wrap" gap={1}>
                    <Chip
                      icon={<WorkIcon />}
                      label={`${resume.years_of_experience} years`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label={resume.education_level}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '& .MuiChip-icon': { color: 'white' },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Card Body */}
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {position.city}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <MoneyIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" fontWeight="medium">
                        {formatSalary(position.salaryMin, position.salaryMax)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      <WorkIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {position.jobType}
                      </Typography>
                    </Box>

                    <Divider />

                    {/* Skills Preview */}
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="medium"
                        display="block"
                        mb={1}
                      >
                        Core Skills
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {resume.skills_summary || 'No skills summary available'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                {/* Card Actions */}
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ViewIcon />}
                    onClick={() => handleViewResume(resume.id)}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8c 100%)',
                      },
                    }}
                  >
                    View Resume
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      ) : (
        // Empty State
        <Paper elevation={0} sx={{ py: 12, textAlign: 'center' }}>
          <Typography variant="h1" fontSize="4rem" mb={2}>
            🔍
          </Typography>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No Resumes Found
          </Typography>
          <Typography color="text.secondary">Try adjusting the filter conditions</Typography>
        </Paper>
      )}

      {/* How it Works Section */}
      <Paper
        elevation={0}
        sx={{
          mt: 8,
          p: 4,
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          💡 How to Use Subscription Mode to View Resumes
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mt: 3,
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              1️⃣
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Browse Encrypted Resumes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View candidates&apos; skill summaries, experience, and expectations, with detailed
              information protected by Seal encryption
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" gutterBottom>
              2️⃣
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Purchase Subscription (Permanent Access)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pay a small amount of Sui, get permanent access after purchase, payment goes directly
              to the resume owner
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" gutterBottom>
              3️⃣
            </Typography>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Decrypt and View Full Resume
            </Typography>
            <Typography variant="body2" color="text.secondary">
              After successful subscription, the system automatically verifies permissions and
              decrypts, view full contact details and information anytime
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight="medium">
            ✨ <strong>Key Features:</strong> Based on Seal subscription mode, pay once for
            permanent access • On-chain permission verification • End-to-end encryption •
            Decentralized storage
          </Typography>
        </Alert>
      </Paper>
    </Container>
    </PageLayout>
  );
}
