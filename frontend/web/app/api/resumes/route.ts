import { NextRequest, NextResponse } from 'next/server';
import { ResumeMetadata, CreateResumeRequest } from '@/app/lib/types';
import { resumesStore, generateResumeId } from '@/app/lib/store/resumes.store';

/**
 * GET /api/resumes
 * 获取简历列表（按 owner 过滤）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');

    if (!owner) {
      return NextResponse.json(
        { error: 'Owner parameter is required' },
        { status: 400 }
      );
    }

    // 过滤出该用户的简历
    const userResumes = Array.from(resumesStore.values())
      .filter((resume) => resume.owner === owner)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      resumes: userResumes,
      total: userResumes.length,
    });
  } catch (error) {
    console.error('Failed to fetch resumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resumes
 * 创建新简历元数据
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateResumeRequest = await request.json();

    // 验证必填字段
    if (!body.blobId || !body.owner || !body.title) {
      return NextResponse.json(
        { error: 'Missing required fields: blobId, owner, title' },
        { status: 400 }
      );
    }

    // 生成唯一 ID
    const id = generateResumeId();
    const now = new Date().toISOString();

    const resume: ResumeMetadata = {
      id,
      blobId: body.blobId,
      owner: body.owner,
      title: body.title,
      summary: body.summary || '',
      encrypted: body.encrypted,
      createdAt: now,
      updatedAt: now,
    };

    resumesStore.set(id, resume);

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error('Failed to create resume:', error);
    return NextResponse.json(
      { error: 'Failed to create resume' },
      { status: 500 }
    );
  }
}
