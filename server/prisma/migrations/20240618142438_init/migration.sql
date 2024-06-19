-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "commentimg" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "postimg" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userimg" DROP NOT NULL;
