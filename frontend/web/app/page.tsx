"use client";
import { Box, Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CreateIcon from '@mui/icons-material/Create';
import ExploreIcon from '@mui/icons-material/Explore';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';

export default function Home() {
  const router = useRouter();
  const { address } = useAccount();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Own Your Career Data, Earn From Every View
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 300,
              }}
            >
              A Web3 decentralized job platform where job seekers control their encrypted resumes{' '}
              <Box component="span" sx={{ fontWeight: 'bold', color: '#ffd700' }}>
                and earn
              </Box>{' '}
              micropayments when recruiters unlock them.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CreateIcon />}
                onClick={() => router.push('/resume/create')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Create Your Resume
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ExploreIcon />}
                onClick={() => router.push('/resume/browse')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Browse Talent
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose ResumeVault?
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Feature 1 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Secure & Private
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Your resume data is encrypted and stored on decentralized networks. Only you control who can access it.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 2 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <MonetizationOnIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Earn From Views
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Set your price and earn cryptocurrency every time a recruiter unlocks and views your resume.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Feature 3 */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                  }}
                >
                  <WorkIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Full Control
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  You own your data. Update, share, or revoke access anytime. Your career, your rules.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6 }}
          >
            How It Works
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {/* Step 1 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  1
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Create Your Resume
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in your professional details using our easy-to-use form builder.
                </Typography>
              </Box>
            </Grid>

            {/* Step 2 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  2
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Set Your Price
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose how much recruiters should pay to unlock your full resume.
                </Typography>
              </Box>
            </Grid>

            {/* Step 3 */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  3
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Earn & Get Hired
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Earn money when recruiters view your resume and land your dream job!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
          Ready to Take Control?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          {address ? "Start creating your resume now!" : "Connect your wallet to get started"}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<CreateIcon />}
          onClick={() => router.push(address ? '/resume/create' : '/resume/list')}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            },
            transition: 'all 0.3s',
          }}
        >
          Get Started
        </Button>
      </Container>

      <Footer />
    </Box>
  );
}
