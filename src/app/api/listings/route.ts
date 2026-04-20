import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { findProfanity } from '@/lib/profanity';
import { prisma } from '@/lib/prisma';
import { CreateListingSchema, PaginationSchema, createPaginatedResponse } from '@/lib/validations';

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

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        include: {
          category: true,
          seller: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { dateListed: 'desc' },
        take: validLimit,
        skip: validOffset,
      }),
      prisma.listing.count(),
    ]);

    return NextResponse.json(
      createPaginatedResponse(listings, total, validLimit, validOffset),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
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
    const validationResult = CreateListingSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, price, imageUrl, category, categoryId } = validationResult.data;

    // Check for profanity
    const profanityHits = findProfanity(`${title} ${description ?? ''}`);
    if (profanityHits.length > 0) {
      return NextResponse.json({ error: 'Profanity is not allowed in listings' }, { status: 400 });
    }

    let finalCategoryId: number | null = categoryId || null;

    if (category) {
      const existingCategory = await prisma.category.findFirst({
        where: { field: category },
      });

      if (existingCategory) {
        finalCategoryId = existingCategory.id;
      } else {
        const createdCategory = await prisma.category.create({
          data: { field: category },
        });
        finalCategoryId = createdCategory.id;
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price,
        imageUrl: imageUrl || null,
        sellerId: userId,
        categoryId: finalCategoryId,
      },
      include: {
        category: true,
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
