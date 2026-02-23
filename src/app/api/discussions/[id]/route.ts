
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const discussionId = parseInt(params.id);
    if (isNaN(discussionId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });
    if (!discussion) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(discussion);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch discussion' }, { status: 500 });
  }
}
