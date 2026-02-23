
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discussionId = parseInt(searchParams.get('discussionId') || '');
    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID' }, { status: 400 });
    }
    const replies = await prisma.reply.findMany({
      where: { discussionId },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(replies);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch replies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, discussionId } = await req.json();
    if (!content || !discussionId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const reply = await prisma.reply.create({
      data: { content, discussionId },
    });
    return NextResponse.json(reply);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 });
  }
}
