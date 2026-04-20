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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      imageUrl,
      category,
    } = body as {
      title?: string;
      description?: string;
      price?: number | string;
      imageUrl?: string;
      category?: string;
    };

    if (!title || typeof title !== 'string') {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const numericPrice = typeof price === 'string' ? Number(price) : price;
    if (typeof numericPrice !== 'number' || !Number.isFinite(numericPrice)) {
      return new Response(JSON.stringify({ error: 'Valid price is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const profanityHits = findProfanity(`${title} ${description ?? ''}`);
    if (profanityHits.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Profanity is not allowed in listings' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const trimmedCategory = typeof category === 'string' ? category.trim() : '';
    let categoryId: number | null = null;

    if (trimmedCategory) {
      const existingCategory = await prisma.category.findFirst({
        where: { field: trimmedCategory },
      });

      if (existingCategory) {
        categoryId = existingCategory.id;
      } else {
        const createdCategory = await prisma.category.create({
          data: { field: trimmedCategory },
        });
        categoryId = createdCategory.id;
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        price: numericPrice,
        imageUrl: imageUrl?.trim() || null,
        sellerId: userId,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    return new Response(JSON.stringify(listing), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to create listing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
