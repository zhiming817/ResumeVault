import { NextRequest, NextResponse } from 'next/server';
import { ResumeMetadata, UpdateResumeRequest } from '@/app/lib/types';
import { resumesStore } from '@/app/lib/store/resumes.store';

/**
 * GET /api/resumes/[id]
 * 获取单个简历元数据
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = resumesStore.get(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/resumes/[id]
 * 更新简历元数据
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = resumesStore.get(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const body: UpdateResumeRequest = await request.json();

    const updatedResume: ResumeMetadata = {
      ...resume,
      title: body.title ?? resume.title,
      summary: body.summary ?? resume.summary,
      updatedAt: new Date().toISOString(),
    };

    resumesStore.set(id, updatedResume);

    return NextResponse.json(updatedResume);
  } catch (error) {
    console.error('Failed to update resume:', error);
    return NextResponse.json(
      { error: 'Failed to update resume' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 * 删除简历元数据
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resume = resumesStore.get(id);

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    resumesStore.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}
