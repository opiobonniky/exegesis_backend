-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "fail_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "last_error" TEXT,
ADD COLUMN     "max_retries" INTEGER NOT NULL DEFAULT 3;
