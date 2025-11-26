'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentAccount } from '@mysten/dapp-kit';
import PageLayout from '@/app/components/layout/PageLayout';
import PersonalInfo from '@/app/components/resume/PersonalInfo';
import Skills from '@/app/components/resume/Skills';
import DesiredPosition from '@/app/components/resume/DesiredPosition';
import WorkExperience from '@/app/components/resume/WorkExperience';
import Education from '@/app/components/resume/Education';
import ProjectExperience from '@/app/components/resume/ProjectExperience';
import Certificates from '@/app/components/resume/Certificates';
import { ResumeData, CreateResumeRequest } from '@/app/lib/types';

export default function ResumeCreate() {
  const router = useRouter();
  const currentAccount = useCurrentAccount();
  const connected = !!currentAccount;
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
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'skills', name: 'Skills', icon: '⭐' },
    { id: 'desired', name: 'Desired Position', icon: '💼' },
    { id: 'work', name: 'Work Experience', icon: '💻' },
    { id: 'project', name: 'Projects', icon: '📁' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'certificate', name: 'Certificates', icon: '📜' },
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
    if (!connected || !currentAccount) {
      alert('请先连接钱包');
      return;
    }

    setIsSubmitting(true);

    try {
      // Dynamically import resume service to avoid WASM SSR issues
      const { createResume, validateResumeData } = await import('@/app/lib/services/resume.service');

      // Validate resume data
      if (!validateResumeData(formData)) {
        alert('请填写必填信息：姓名和邮箱');
        setIsSubmitting(false);
        return;
      }

      console.log('💾 Saving resume...');
      console.log('📋 Data:', formData);

      // Create resume and upload to Walrus (without encryption)
      const result = await createResume(formData, false);

      console.log('✅ Resume saved successfully!');
      console.log('🆔 Blob ID:', result.blobId);
      console.log('🔑 Encryption Key:', result.encryptionKey ? result.encryptionKey.substring(0, 20) + '...' : 'None');
      console.log('🌐 URL:', result.url);

      // 保存元数据到后端 API
      const resumeTitle = `${formData.personal.name} - ${formData.desiredPosition.position || '求职者'}`;
      const resumeSummary = `${formData.skills.substring(0, 100)}${formData.skills.length > 100 ? '...' : ''}`;

      const createRequest: CreateResumeRequest = {
        blobId: result.blobId,
        owner: currentAccount.address,
        title: resumeTitle,
        summary: resumeSummary,
        encrypted: false,
      };

      console.log('💾 Saving metadata to API...');
      const apiResponse = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createRequest),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to save resume metadata');
      }

      const resumeMetadata = await apiResponse.json();
      console.log('✅ Metadata saved:', resumeMetadata);

      alert(`简历保存成功！\n\nBlob ID: ${result.blobId}`);

      // Navigate to success page or resume list
      router.push('/resume');
    } catch (error) {
      console.error('❌ Failed to save resume:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`保存简历失败: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Resume</h1>
          <p className="text-white/80">Fill in your professional information</p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-24">
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-orange-100 text-orange-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span>{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-lg p-8">
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
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Resume'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
