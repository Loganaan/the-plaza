import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const errors: any = {};
    
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.length === 0 || body.name.length > 100)) {
      errors.name = 'Name must be between 1-100 characters';
    }
    if (body.bio !== undefined && (typeof body.bio !== 'string' || body.bio.length > 500)) {
      errors.bio = 'Bio must be at most 500 characters';
    }
    if (body.location !== undefined && (typeof body.location !== 'string' || body.location.length > 100)) {
      errors.location = 'Location must be at most 100 characters';
    }
    if (body.canReceiveMessages !== undefined && typeof body.canReceiveMessages !== 'boolean') {
      errors.canReceiveMessages = 'Must be a boolean';
    }
    if (body.listingVisibility !== undefined && !['public', 'private', 'contacts-only'].includes(body.listingVisibility)) {
      errors.listingVisibility = 'Invalid listing visibility';
    }
    if (body.profileVisibility !== undefined && !['public', 'private'].includes(body.profileVisibility)) {
      errors.profileVisibility = 'Invalid profile visibility';
    }
    if (body.notificationsEnabled !== undefined && typeof body.notificationsEnabled !== 'boolean') {
      errors.notificationsEnabled = 'Must be a boolean';
    }
    if (body.emailNotifications !== undefined && typeof body.emailNotifications !== 'boolean') {
      errors.emailNotifications = 'Must be a boolean';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Invalid input', details: errors },
        { status: 400 }
      );
    }

    const updateData = body;

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
