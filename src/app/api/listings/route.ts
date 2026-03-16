import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : null;
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null;
    const parsedPrice = Number(body.price);
    const categoryId = Number.isInteger(body.categoryId) ? body.categoryId : null;
    const requestedSellerId = Number.isInteger(body.sellerId) ? body.sellerId : null;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return NextResponse.json({ error: 'Price must be a valid non-negative number' }, { status: 400 });
    }

    let sellerId = requestedSellerId;

    if (!sellerId) {
      const fallbackSeller = await prisma.user.findFirst({
        orderBy: { id: 'asc' },
        select: { id: true },
      });

      if (!fallbackSeller) {
        return NextResponse.json(
          { error: 'No users found. Create or seed a user before creating listings.' },
          { status: 400 }
        );
      }

      sellerId = fallbackSeller.id;
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: parsedPrice,
        imageUrl: imageUrl || null,
        sellerId,
        ...(categoryId ? { categoryId } : {}),
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
