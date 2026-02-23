
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all discussions
export async function GET() {
  try {
    const discussions = await prisma.discussion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(discussions);
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
  }
}

// POST create a new discussion
export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const discussion = await prisma.discussion.create({
      data: { title, description },
    });

    return NextResponse.json(discussion);
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 });
  }
}
