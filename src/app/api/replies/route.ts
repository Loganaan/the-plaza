import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { validateCreateReply } from '@/lib/validations';
import { findProfanity } from '@/lib/profanity';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discussionId = parseInt(searchParams.get('discussionId') || '');

    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }

    const replies = await prisma.reply.findMany({
      where: { discussionId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(replies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = validateCreateReply(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error },
        { status: 400 }
      );
    }

    const { content, discussionId } = validationResult.data;

    // Check for profanity
    const profanityHits = findProfanity(content);
    if (profanityHits.length > 0) {
      return NextResponse.json(
        { error: 'Profanity is not allowed in replies' },
        { status: 400 }
      );
    }

    // Verify discussion exists
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { id: true },
    });

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        content,
        discussionId,
        userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
