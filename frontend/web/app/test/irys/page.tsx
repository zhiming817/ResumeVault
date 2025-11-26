'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import PageLayout from '@/app/components/layout/PageLayout';

export default function IrysTest() {
  const { address, isConnected } = useAccount();
  
  const [uploadText, setUploadText] = useState('Hello from Irys Testnet!');
  const [uploadResult, setUploadResult] = useState<{
    id: string;
    url: string;
    timestamp: string;
  } | null>(null);
  const [downloadId, setDownloadId] = useState('');
  const [downloadResult, setDownloadResult] = useState<string>('');
  
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleUpload = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setUploading(true);
    setError('');
    setUploadResult(null);

    try {
      console.log('🚀 Starting upload to Irys...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock ID (in production this would come from Irys)
      const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      console.log('✅ Upload simulated successfully!');

      setUploadResult({
        id: mockId,
        url: `https://gateway.irys.xyz/${mockId}`,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadId.trim()) {
      setError('Please enter a data ID');
      return;
    }

    setDownloading(true);
    setError('');
    setDownloadResult('');

    try {
      console.log('⬇️ Downloading from Irys...');
      const url = `https://gateway.irys.xyz/${downloadId}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log('✅ Download successful!');
      
      setDownloadResult(text);
    } catch (err) {
      console.error('❌ Download failed:', err);
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
  };

  return (
    <PageLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Irys Upload & Download Test
          </Typography>
          <Typography color="text.secondary" variant="body1">
            Test permanent data storage with Irys
          </Typography>
        </Box>

        {/* Connection Status */}
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to use Irys upload functionality
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => setError('')}
            icon={<ErrorIcon />}
          >
            {error}
          </Alert>
        )}

        <Stack spacing={4}>
          {/* Upload Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📤 Upload Data
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <TextField
                label="Text to Upload"
                multiline
                rows={4}
                fullWidth
                value={uploadText}
                onChange={(e) => setUploadText(e.target.value)}
                placeholder="Enter text to upload to Irys..."
              />

              <Button
                variant="contained"
                size="large"
                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                onClick={handleUpload}
                disabled={uploading || !isConnected || !uploadText.trim()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8c 100%)',
                  },
                }}
              >
                {uploading ? 'Uploading...' : 'Upload to Irys'}
              </Button>

              {uploadResult && (
                <Card sx={{ bgcolor: 'success.50', border: 1, borderColor: 'success.200' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CheckCircleIcon color="success" />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        Upload Successful!
                      </Typography>
                    </Box>

                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Data ID
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body2"
                            fontFamily="monospace"
                            sx={{
                              wordBreak: 'break-all',
                              bgcolor: 'white',
                              p: 1,
                              borderRadius: 1,
                              flex: 1,
                            }}
                          >
                            {uploadResult.id}
                          </Typography>
                          <Button size="small" onClick={() => handleCopyId(uploadResult.id)}>
                            Copy
                          </Button>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Gateway URL
                        </Typography>
                        <Typography
                          variant="body2"
                          component="a"
                          href={uploadResult.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            wordBreak: 'break-all',
                          }}
                        >
                          {uploadResult.url}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Timestamp
                        </Typography>
                        <Typography variant="body2">{uploadResult.timestamp}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Paper>

          {/* Download Section */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              📥 Download Data
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Stack spacing={2}>
              <TextField
                label="Data ID"
                fullWidth
                value={downloadId}
                onChange={(e) => setDownloadId(e.target.value)}
                placeholder="Enter Irys data ID to download..."
                helperText="Paste the data ID from a previous upload"
              />

              <Button
                variant="outlined"
                size="large"
                startIcon={downloading ? <CircularProgress size={20} /> : <CloudDownloadIcon />}
                onClick={handleDownload}
                disabled={downloading || !downloadId.trim()}
              >
                {downloading ? 'Downloading...' : 'Download from Irys'}
              </Button>

              {downloadResult && (
                <Card sx={{ bgcolor: 'info.50', border: 1, borderColor: 'info.200' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CheckCircleIcon color="info" />
                      <Typography variant="h6" fontWeight="bold" color="info.main">
                        Download Successful!
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Downloaded Content
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: 'white',
                          border: 1,
                          borderColor: 'grey.300',
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontFamily="monospace"
                          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                        >
                          {downloadResult}
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Paper>

          {/* Info Section */}
          <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              📝 Demo Mode
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This page currently demonstrates the UI with simulated uploads.
              <br />
              <br />
              To implement real Irys functionality:
              <br />
              1. Use @irys/sdk WebIrys for browser integration
              <br />
              2. Connect to Irys testnet: https://testnet-rpc.irys.xyz
              <br />
              3. Get test tokens from: <a href="https://wallet.irys.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>wallet.irys.xyz</a>
            </Typography>
          </Alert>

          <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              ℹ️ About Irys
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                • Irys provides permanent, decentralized data storage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Data is cryptographically verified and immutable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Access your data anytime via the gateway URL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Ideal for storing resumes, documents, and other important files
              </Typography>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </PageLayout>
  );
}
