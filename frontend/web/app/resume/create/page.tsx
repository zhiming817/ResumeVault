'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import SchoolIcon from '@mui/icons-material/School';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PageLayout from '@/app/components/layout/PageLayout';
import PersonalInfo from '@/app/components/resume/PersonalInfo';
import Skills from '@/app/components/resume/Skills';
import DesiredPosition from '@/app/components/resume/DesiredPosition';
import WorkExperience from '@/app/components/resume/WorkExperience';
import Education from '@/app/components/resume/Education';
import ProjectExperience from '@/app/components/resume/ProjectExperience';
import Certificates from '@/app/components/resume/Certificates';
import { ResumeData } from '@/app/lib/types';

export default function ResumeCreate() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const connected = isConnected;
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState<ResumeData>({
    personal: {
      name: '',
      gender: 'male',
      birthDate: '',
      workStartDate: '',
      jobStatus: 'employed',
      identity: 'professional',
      phone: '',
      wechat: '',
      email: '',
    },
    skills: '',
    desiredPosition: {
      jobType: 'fulltime',
      position: '',
      industry: '',
      salaryMin: '',
      salaryMax: '',
      city: '',
      otherCities: '',
    },
    workExperience: [],
    projectExperience: [],
    education: [],
    certificates: [],
  });

  // Sidebar navigation
  const sections = [
    { id: 'personal', name: 'Personal Info', icon: <PersonIcon /> },
    { id: 'skills', name: 'Skills', icon: <StarIcon /> },
    { id: 'desired', name: 'Desired Position', icon: <WorkIcon /> },
    { id: 'work', name: 'Work Experience', icon: <CodeIcon /> },
    { id: 'project', name: 'Projects', icon: <FolderIcon /> },
    { id: 'education', name: 'Education', icon: <SchoolIcon /> },
    { id: 'certificate', name: 'Certificates', icon: <CardMembershipIcon /> },
  ];

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => {
      const sectionData = prev[section as keyof ResumeData];
      if (typeof sectionData === 'object' && !Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value,
          },
        };
      }
      return prev;
    });
  };

  const handleSave = async () => {
    // Check wallet connection
    if (!connected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.personal.name || !formData.personal.email) {
        alert('Please fill in required fields: Name and Email');
        setIsSubmitting(false);
        return;
      }

      console.log('💾 Saving resume...');
      console.log('📋 Data:', formData);

      // 直接调用后端 API 保存简历
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiResponse = await fetch(`${apiBaseUrl}/api/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: address,
          personal: {
            name: formData.personal.name,
            gender: formData.personal.gender,
            birth_date: formData.personal.birthDate,
            work_start_date: formData.personal.workStartDate,
            job_status: formData.personal.jobStatus,
            identity: formData.personal.identity,
            phone: formData.personal.phone,
            wechat: formData.personal.wechat,
            email: formData.personal.email,
          },
          skills: formData.skills,
          desired_position: {
            job_type: formData.desiredPosition.jobType,
            position: formData.desiredPosition.position,
            industry: formData.desiredPosition.industry,
            salary_min: formData.desiredPosition.salaryMin ? parseInt(formData.desiredPosition.salaryMin, 10) : 0,
            salary_max: formData.desiredPosition.salaryMax ? parseInt(formData.desiredPosition.salaryMax, 10) : 0,
            city: formData.desiredPosition.city,
            other_cities: formData.desiredPosition.otherCities 
              ? formData.desiredPosition.otherCities.split(',').map(c => c.trim()).filter(c => c.length > 0)
              : [],
          },
          work_experience: formData.workExperience.map(exp => ({
            company: exp.company,
            industry: exp.industry,
            department: exp.department,
            position: exp.position,
            start_date: exp.startDate,
            end_date: exp.endDate,
            current: exp.current,
            description: exp.description,
          })),
          project_experience: formData.projectExperience.map(proj => ({
            name: proj.name,
            role: proj.role,
            link: proj.link || undefined,
            start_date: proj.startDate,
            end_date: proj.endDate,
            current: proj.current,
            description: proj.description,
            achievements: proj.achievements || undefined,
            technologies: proj.technologies || undefined,
          })),
          education: formData.education.map(edu => ({
            school: edu.school,
            degree: edu.degree,
            education_type: edu.educationType,
            major: edu.major,
            start_date: edu.startDate,
            end_date: edu.endDate,
            experience: edu.experience || undefined,
            thesis: edu.thesis || undefined,
            thesis_description: edu.thesisDescription || undefined,
          })),
          certificates: formData.certificates.map(cert => ({
            name: cert.name,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            expiry_date: cert.expiryDate || undefined,
            no_expiry: cert.noExpiry,
            certificate_no: cert.certificateNo || undefined,
            description: cert.description || undefined,
          })),
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to save resume');
      }

      const result = await apiResponse.json();
      console.log('✅ Resume saved:', result);

      // Process response format { success: true, data: {...} }
      if (result.success) {
        alert(`Resume saved successfully!`);
        // Navigate to resume list
        router.push('/resume/list');
      } else {
        throw new Error(result.error || 'Failed to save resume');
      }
    } catch (error) {
      console.error('❌ Failed to save resume:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to save resume: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Create Your Resume
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in your professional information
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Sidebar */}
          <Paper
            sx={{
              width: 280,
              flexShrink: 0,
              position: 'sticky',
              top: 96,
              alignSelf: 'flex-start',
            }}
          >
            <List component="nav">
              {sections.map((section) => (
                <ListItemButton
                  key={section.id}
                  selected={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{section.icon}</ListItemIcon>
                  <ListItemText primary={section.name} />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          {/* Main Content */}
          <Paper sx={{ flex: 1, p: 4 }}>
            {activeSection === 'personal' && (
              <PersonalInfo formData={formData} handleInputChange={handleInputChange} />
            )}
            {activeSection === 'skills' && (
              <Skills formData={formData} setFormData={setFormData} />
            )}
            {activeSection === 'desired' && (
              <DesiredPosition
                data={formData.desiredPosition}
                onChange={(field, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    desiredPosition: {
                      ...prev.desiredPosition,
                      [field]: value,
                    },
                  }))
                }
              />
            )}
            {activeSection === 'work' && (
              <WorkExperience
                data={formData.workExperience}
                onChange={(experiences) =>
                  setFormData((prev) => ({
                    ...prev,
                    workExperience: experiences,
                  }))
                }
              />
            )}
            {activeSection === 'education' && (
              <Education
                data={formData.education}
                onChange={(education) =>
                  setFormData((prev) => ({
                    ...prev,
                    education: education,
                  }))
                }
              />
            )}
            {activeSection === 'project' && (
              <ProjectExperience
                data={formData.projectExperience}
                onChange={(projects) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectExperience: projects,
                  }))
                }
              />
            )}
            {activeSection === 'certificate' && (
              <Certificates
                data={formData.certificates}
                onChange={(certificates) =>
                  setFormData((prev) => ({
                    ...prev,
                    certificates: certificates,
                  }))
                }
              />
            )}

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.back()}
                sx={{ textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={isSubmitting}
                sx={{ textTransform: 'none' }}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Saving...' : 'Save Resume'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </PageLayout>
  );
}
