import { NextRequest, NextResponse } from 'next/server';
import { resumesStore } from '@/app/lib/store/resumes.store';
import { ResumeMetadata } from '@/app/lib/types';

/**
 * GET /api/resumes/my/[walletAddress]
 * 获取指定钱包地址的所有简历
 * 返回格式与demo保持一致: { success: boolean, data: Array, error?: string }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;

    if (!walletAddress) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少钱包地址参数' 
        },
        { status: 400 }
      );
    }

    // 从存储中获取该用户的所有简历
    const allResumes = Array.from(resumesStore.values());
    const userResumes = allResumes.filter(
      (resume: ResumeMetadata) => resume.owner === walletAddress
    );
    
    // 按更新时间倒序排序
    const sortedResumes = userResumes.sort(
      (a: ResumeMetadata, b: ResumeMetadata) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // 返回与demo一致的格式
    return NextResponse.json({
      success: true,
      data: sortedResumes,
    });
  } catch (error) {
    console.error('获取简历列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '获取简历列表失败' 
      },
      { status: 500 }
    );
  }
}
