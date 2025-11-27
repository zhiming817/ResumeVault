/**
 * API 配置
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://miniapp.egtoy.xyz/backend';

export const API_ENDPOINTS = {
  resumes: {
    create: '/api/resumes/create',
    getSummaries: '/api/resumes/summaries',
    getDetail: '/api/resumes/detail',
    update: '/api/resumes/update',
    delete: '/api/resumes/delete',
    getMyResumes: '/api/resumes/my',
  },
  users: {
    getProfile: '/api/users/profile',
    updateProfile: '/api/users/update',
  },
  encryption: {
    publish: '/api/encryption/publish',
    decrypt: '/api/encryption/decrypt',
  },
} as const;
