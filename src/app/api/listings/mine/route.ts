import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const listings = await prisma.listing.findMany({
      where: { sellerId: userId },
      include: {
        category: true,
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
