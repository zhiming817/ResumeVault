import { ResumeMetadata } from '@/app/lib/types';

/**
 * 简单的内存存储
 * 生产环境应使用数据库（如 MongoDB、PostgreSQL 等）
 */
export const resumesStore = new Map<string, ResumeMetadata>();

/**
 * 生成唯一 ID
 */
export function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
