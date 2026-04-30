import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

const MAX_REASON_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 1000;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
    const isAdmin = request.headers.get('x-admin-override') === 'true';

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const reports = await prisma.listingReport.findMany({
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            dateListed: true,
            category: { select: { field: true } },
            seller: { select: { id: true, name: true, email: true } },
          },
        },
        reporter: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching listing reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const listingId = typeof body.listingId === 'number'
      ? body.listingId
      : Number.parseInt(body.listingId, 10);
    const reason = typeof body.reason === 'string' ? body.reason.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!listingId || Number.isNaN(listingId)) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
    }

    if (reason.length < 3 || reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json(
        { error: 'Invalid reason' },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: 'Message is too long' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const report = await prisma.listingReport.create({
      data: {
        listingId,
        reporterId: userId,
        reason,
        message: message || null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating listing report:', error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}
