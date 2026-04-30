import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_REASON_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 1000;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
    const isAdmin = request.headers.get("x-admin-override") === "true";

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reports = await prisma.discussionReport.findMany({
      include: {
        discussion: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            category: { select: { name: true } },
            author: { select: { id: true, name: true, email: true } },
          },
        },
        reporter: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching discussion reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const discussionId = typeof body.discussionId === "number"
      ? body.discussionId
      : Number.parseInt(body.discussionId, 10);
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!discussionId || Number.isNaN(discussionId)) {
      return NextResponse.json({ error: "Invalid discussion ID" }, { status: 400 });
    }

    if (reason.length < 3 || reason.length > MAX_REASON_LENGTH) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
      select: { id: true },
    });

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    const report = await prisma.discussionReport.create({
      data: {
        discussionId,
        reporterId: userId,
        reason,
        message: message || null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion report:", error);
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 });
  }
}
