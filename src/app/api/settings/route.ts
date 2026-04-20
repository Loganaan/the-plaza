import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Get user settings and stats
export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        bio: true,
        location: true,
        canReceiveMessages: true,
        listingVisibility: true,
        profileVisibility: true,
        notificationsEnabled: true,
        emailNotifications: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user stats
    const [listingCount, discussionCount, replyCount] = await Promise.all([
      prisma.listing.count({ where: { sellerId: userId } }),
      prisma.discussion.count({ where: { userId } }),
      prisma.reply.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      user,
      stats: {
        listingsCreated: listingCount,
        discussionsCreated: discussionCount,
        repliesCreated: replyCount,
      },
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Update user settings
const UpdateSettingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  canReceiveMessages: z.boolean().optional(),
  listingVisibility: z.enum(['public', 'private', 'contacts-only']).optional(),
  profileVisibility: z.enum(['public', 'private']).optional(),
  notificationsEnabled: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = UpdateSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        bio: true,
        location: true,
        canReceiveMessages: true,
        listingVisibility: true,
        profileVisibility: true,
        notificationsEnabled: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
