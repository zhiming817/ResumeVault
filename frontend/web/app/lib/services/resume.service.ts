/**
 * 简历服务
 * 处理简历的创建、加密、上传、下载和解密
 */

import { uploadToWalrus, downloadFromWalrus } from '../utils/walrus';
import { encryptWithSeal, decryptWithSeal } from '../utils/seal';
import type { ResumeData, ResumeFormData } from '../types';

/**
 * 创建简历结果
 */
export interface CreateResumeResult {
  blobId: string;
  encryptionKey: string;
  url: string;
}

/**
 * 创建简历 (带加密和 Walrus 上传)
 * @param resumeData - 简历数据
 * @param useSealEncryption - 是否使用 Seal 加密
 * @param signer - 可选的签名者
 * @returns 创建结果
 */
export async function createResume(
  resumeData: ResumeData | ResumeFormData,
  useSealEncryption = true,
  signer?: unknown
): Promise<CreateResumeResult> {
  try {
    console.log('📝 Creating resume...');
    console.log('🔐 Encryption enabled:', useSealEncryption);

    let blobToUpload: Blob;
    let encryptionKey = '';

    if (useSealEncryption) {
      // 1. 使用 Seal 加密
      console.log('🔒 Step 1: Encrypting with Seal...');
      const { encryptedBlob, key } = await encryptWithSeal(resumeData);
      blobToUpload = encryptedBlob;
      encryptionKey = key;
      
      console.log('✅ Encryption complete');
      console.log('🔑 Encryption key:', key.substring(0, 20) + '...');
    } else {
      // 不加密，直接转换为 Blob
      const jsonString = JSON.stringify(resumeData);
      blobToUpload = new Blob([jsonString], { type: 'application/json' });
    }

    // 2. 上传到 Walrus
    console.log('☁️  Step 2: Uploading to Walrus...');
    const { blobId, url } = await uploadToWalrus(
      blobToUpload,
      {
        type: 'resume',
        encrypted: useSealEncryption,
        timestamp: new Date().toISOString(),
      },
      signer
    );

    console.log('✅ Resume created successfully!');
    console.log('🆔 Blob ID:', blobId);
    console.log('🌐 URL:', url);

    return {
      blobId,
      encryptionKey,
      url,
    };
  } catch (error) {
    console.error('❌ Failed to create resume:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Resume creation failed: ${message}`);
  }
}

/**
 * 从 Walrus 下载并解密简历
 * @param blobId - Walrus blob ID
 * @param encryptionKey - 加密密钥（如果简历已加密）
 * @returns 简历数据
 */
export async function downloadResume<T = ResumeData>(
  blobId: string,
  encryptionKey?: string
): Promise<T> {
  try {
    console.log('📥 Downloading resume...');
    console.log('🆔 Blob ID:', blobId);

    // 1. 从 Walrus 下载加密的 blob
    console.log('⬇️  Step 1: Downloading from Walrus...');
    const blob = await downloadFromWalrus(blobId);

    console.log('✅ Download complete');
    console.log('📦 Size:', blob.size, 'bytes');

    // 2. 解密（如果提供了密钥）
    if (encryptionKey) {
      console.log('🔓 Step 2: Decrypting with Seal...');
      const resumeData = await decryptWithSeal<T>(blob, encryptionKey);
      console.log('✅ Resume downloaded and decrypted successfully!');
      return resumeData;
    } else {
      // 未加密，直接解析 JSON
      const text = await blob.text();
      const resumeData = JSON.parse(text) as T;
      console.log('✅ Resume downloaded successfully!');
      return resumeData;
    }
  } catch (error) {
    console.error('❌ Failed to download resume:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Resume download failed: ${message}`);
  }
}

/**
 * 更新简历
 * @param blobId - 旧的 blob ID
 * @param resumeData - 新的简历数据
 * @param encryptionKey - 加密密钥（如果需要加密）
 * @param signer - 签名者
 * @returns 新的创建结果
 */
export async function updateResume(
  blobId: string,
  resumeData: ResumeData | ResumeFormData,
  encryptionKey?: string,
  signer?: unknown
): Promise<CreateResumeResult> {
  try {
    console.log('🔄 Updating resume...');
    console.log('🆔 Old Blob ID:', blobId);

    // 更新实际上是创建新版本
    const result = await createResume(resumeData, !!encryptionKey, signer);

    console.log('✅ Resume updated successfully!');
    console.log('🆔 New Blob ID:', result.blobId);

    return result;
  } catch (error) {
    console.error('❌ Failed to update resume:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Resume update failed: ${message}`);
  }
}

/**
 * 验证简历数据完整性
 * @param resumeData - 简历数据
 * @returns 是否有效
 */
export function validateResumeData(resumeData: Partial<ResumeData>): boolean {
  try {
    // 检查必填字段
    if (!resumeData.personal) {
      console.error('Missing personal info');
      return false;
    }

    if (!resumeData.personal.name || !resumeData.personal.email) {
      console.error('Missing required personal fields');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Resume validation failed:', error);
    return false;
  }
}

/**
 * 生成简历摘要
 * @param resumeData - 简历数据
 * @returns 简历摘要
 */
export function generateResumeSummary(resumeData: ResumeData) {
  return {
    name: resumeData.personal.name,
    position: resumeData.desiredPosition.position,
    yearsOfExperience: resumeData.workExperience.length,
    educationLevel: resumeData.education[0]?.degree || 'unknown',
    skills: resumeData.skills.substring(0, 100),
  };
}
