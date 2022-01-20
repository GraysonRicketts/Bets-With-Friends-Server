/*
  Warnings:

  - You are about to drop the column `before` on the `audit` table. All the data in the column will be lost.
  - You are about to drop the column `diff` on the `audit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit" DROP COLUMN "before",
DROP COLUMN "diff",
ADD COLUMN     "action" JSONB,
ADD COLUMN     "data" JSONB,
ADD COLUMN     "target_id" TEXT,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "bet" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "friend" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "friend_request" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "option" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid (),
ALTER COLUMN "score" SET DEFAULT 3000;

-- AlterTable
ALTER TABLE "user_group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "wager" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();
