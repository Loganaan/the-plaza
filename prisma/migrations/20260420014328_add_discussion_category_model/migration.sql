-- AlterTable
ALTER TABLE "Discussion" ADD COLUMN     "categoryId" INTEGER;

-- CreateTable
CREATE TABLE "DiscussionCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DiscussionCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DiscussionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
