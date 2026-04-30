
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { UpdateDiscussionSchema } from '@/lib/validations';
import { findProfanity } from '@/lib/profanity';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const discussionId = parseInt(id);
    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!discussion) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(discussion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch discussion' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const discussionId = parseInt(id);

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }

    const existingDiscussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { userId: true },
    });

    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (existingDiscussion.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = UpdateDiscussionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, categoryId } = validationResult.data;

    // Check for profanity if title or description is being updated
    if (title || description) {
      const profanityHits = findProfanity(`${title || ''} ${description || ''}`);
      if (profanityHits.length > 0) {
        return NextResponse.json({ error: 'Profanity is not allowed in discussions' }, { status: 400 });
      }
    }

    const updateData: Record<string, string | number | null | undefined> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    const updatedDiscussion = await prisma.discussion.update({
      where: { id: discussionId },
      data: updateData,
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedDiscussion);
  } catch (error) {
    console.error('Error updating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to update discussion' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const discussionId = parseInt(id);

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }

    const existingDiscussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { userId: true },
    });

    if (!existingDiscussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    if (existingDiscussion.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.discussion.delete({
      where: { id: discussionId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting discussion:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete discussion' },
      { status: 500 }
    );
  }
}
