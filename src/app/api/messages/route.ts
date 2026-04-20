import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId, 10) },
      select: { buyerId: true, sellerId: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const isBuyer = conversation.buyerId === userId;
    const isSeller = conversation.sellerId === userId;

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const receiverId = isBuyer ? conversation.sellerId : conversation.buyerId;

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: parseInt(conversationId),
        senderId: userId,
        receiverId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
