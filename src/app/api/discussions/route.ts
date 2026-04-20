import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { findProfanity } from '@/lib/profanity';
import { prisma } from '@/lib/prisma';
import { CreateDiscussionSchema, PaginationSchema, createPaginatedResponse } from '@/lib/validations';

// GET all discussions with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate pagination params
    const paginationResult = PaginationSchema.safeParse({ limit, offset });
    if (!paginationResult.success) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    const { limit: validLimit, offset: validOffset } = paginationResult.data;

    const [discussions, total] = await Promise.all([
      prisma.discussion.findMany({
        include: {
          category: true,
          author: {
            select: { id: true, name: true, email: true },
          },
          replies: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: validLimit,
        skip: validOffset,
      }),
      prisma.discussion.count(),
    ]);

    return NextResponse.json(
      createPaginatedResponse(discussions, total, validLimit, validOffset)
    );
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST create a new discussion
export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = CreateDiscussionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, categoryId } = validationResult.data;

    // Check for profanity
    const profanityHits = findProfanity(`${title} ${description}`);
    if (profanityHits.length > 0) {
      return NextResponse.json(
        { error: 'Profanity is not allowed in discussions' },
        { status: 400 }
      );
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        description,
        userId,
        categoryId: categoryId || null,
      },
      include: {
        category: true,
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}
