import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { findProfanity } from '@/lib/profanity';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        category: true, // joins the category info
      },
      orderBy: {
        dateListed: 'desc',
      },
    });

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch listings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
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
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : null;
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null;
    const parsedPrice = Number(body.price);
    const categoryFromName = typeof body.category === 'string' ? body.category.trim() : '';
    const categoryFromId = Number.isInteger(body.categoryId) ? body.categoryId : null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: 'Price must be a valid non-negative number' }, { status: 400 });
    }

    const profanityHits = findProfanity(`${title} ${description ?? ''}`);
    if (profanityHits.length > 0) {
      return NextResponse.json({ error: 'Profanity is not allowed in listings' }, { status: 400 });
    }

    let categoryId: number | null = categoryFromId;

    if (categoryFromName) {
      const existingCategory = await prisma.category.findFirst({
        where: { field: categoryFromName },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const createdCategory = await prisma.category.create({
          data: { field: categoryFromName },
        });
        categoryId = createdCategory.id;
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: parsedPrice,
        imageUrl: imageUrl || null,
        sellerId: userId,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
