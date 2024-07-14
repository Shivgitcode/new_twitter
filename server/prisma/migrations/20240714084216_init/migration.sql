/*
  Warnings:

  - The `likes` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "likedBy" TEXT[],
DROP COLUMN "likes",
ADD COLUMN     "likes" INTEGER DEFAULT 0;
