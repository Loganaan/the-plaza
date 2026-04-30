-- CreateTable
CREATE TABLE "DiscussionReport" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "message" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "DiscussionReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DiscussionReport_discussionId_idx" ON "DiscussionReport"("discussionId");

-- CreateIndex
CREATE INDEX "DiscussionReport_reporterId_idx" ON "DiscussionReport"("reporterId");

-- CreateIndex
CREATE INDEX "DiscussionReport_status_idx" ON "DiscussionReport"("status");

-- AddForeignKey
ALTER TABLE "DiscussionReport" ADD CONSTRAINT "DiscussionReport_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscussionReport" ADD CONSTRAINT "DiscussionReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
