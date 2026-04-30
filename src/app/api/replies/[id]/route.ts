import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateUpdateReply } from '@/lib/validations';
import { findProfanity } from '@/lib/profanity';

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
    const replyId = parseInt(id);

    if (isNaN(replyId)) {
      return NextResponse.json({ error: 'Invalid reply ID' }, { status: 400 });
    }

    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { userId: true },
    });

    if (!existingReply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existingReply.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = validateUpdateReply(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      );
    }

    const { content } = validationResult.data;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Check for profanity
    const profanityHits = findProfanity(content);
    if (profanityHits.length > 0) {
      return NextResponse.json({ error: 'Profanity is not allowed in replies' }, { status: 400 });
    }

    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: { content },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(updatedReply);
  } catch (error) {
    console.error('Error updating reply:', error);
    return NextResponse.json(
      { error: 'Failed to update reply' },
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
    const replyId = parseInt(id);

    if (isNaN(replyId)) {
      return NextResponse.json({ error: 'Invalid reply ID' }, { status: 400 });
    }

    const existingReply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { userId: true },
    });

    if (!existingReply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    if (existingReply.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.reply.delete({
      where: { id: replyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reply:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      return NextResponse.json(
        { error: 'Reply not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete reply' },
      { status: 500 }
    );
  }
}
