/**
 * 简历数据类型定义
 */

export interface PersonalInfo {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  workStartDate: string;
  jobStatus: 'employed' | 'unemployed' | 'looking';
  identity: 'professional' | 'student' | 'fresh';
  phone: string;
  wechat: string;
  email: string;
}

export interface DesiredPosition {
  jobType: 'fulltime' | 'parttime' | 'internship';
  position: string;
  industry: string;
  salaryMin: string;
  salaryMax: string;
  city: string;
  otherCities?: string;
}

export interface WorkExperience {
  company: string;
  industry: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ProjectExperience {
  name: string;
  role: string;
  link?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string;
  technologies?: string;
}

export interface Education {
  school: string;
  degree: 'bachelor' | 'master' | 'doctor' | 'associate';
  educationType: 'fulltime' | 'parttime';
  major: string;
  startDate: string;
  endDate: string;
  experience?: string;
  thesis?: string;
  thesisDescription?: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  noExpiry?: boolean;
  certificateNo?: string;
  description?: string;
  number?: string;
  date?: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  skills: string;
  desiredPosition: DesiredPosition;
  workExperience: WorkExperience[];
  projectExperience: ProjectExperience[];
  education: Education[];
  certificates: Certificate[];
}

export interface ResumeFormData {
  owner: string;
  personal: PersonalInfo;
  skills: string;
  desired_position: DesiredPosition;
  work_experience: WorkExperience[];
  project_experience: ProjectExperience[];
  education: Education[];
  certificates: Certificate[];
}

export interface ResumeSummary {
  id: string;
  owner: string;
  skills_summary: string;
  desired_position_summary: string;
  years_of_experience: number;
  education_level: string;
  blob_id: string;
  encryption_type: 'seal' | 'simple';
  created_at: string;
  updated_at: string;
}

export interface ResumeDetail {
  id: string;
  owner: string;
  personal: PersonalInfo;
  skills: string;
  desired_position: DesiredPosition;
  work_experience: WorkExperience[];
  project_experience: ProjectExperience[];
  education: Education[];
  certificates: Certificate[];
  blob_id: string;
  encryption_type: 'seal' | 'simple';
  created_at: string;
  updated_at: string;
}

/**
 * 简历元数据 - 用于存储和检索简历基本信息
 */
export interface ResumeMetadata {
  id: string;
  blobId?: string; // 可选，因为后端可能返回 null
  blob_id?: string; // 后端使用下划线命名
  owner: string;
  title?: string; // 可选
  name?: string | null; // 后端返回的字段名
  summary?: string; // 可选
  encrypted: boolean;
  encryptionKey?: string; // 仅在客户端保存时使用，不上传到服务器
  encryption_type?: string; // 后端字段
  createdAt?: string; // 可选
  created_at?: string; // 后端使用下划线命名
  updatedAt?: string; // 可选
  updated_at?: string; // 后端使用下划线命名
  status?: string;
  unlock_count?: number;
  view_count?: number;
}

/**
 * API 请求/响应类型
 */
export interface CreateResumeRequest {
  blobId: string;
  owner: string;
  title: string;
  summary: string;
  encrypted: boolean;
}

export interface UpdateResumeRequest {
  title?: string;
  summary?: string;
}

export interface ResumeListResponse {
  resumes: ResumeMetadata[];
  total: number;
}
