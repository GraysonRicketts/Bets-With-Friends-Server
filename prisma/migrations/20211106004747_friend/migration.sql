/*
  Warnings:

  - You are about to drop the column `finalOption` on the `option` table. All the data in the column will be lost.
  - Made the column `group_id` on table `bet` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "bet" DROP CONSTRAINT "bet_group_id_fkey";

-- AlterTable
ALTER TABLE "audit" ADD COLUMN     "trace_id" TEXT,
ADD COLUMN     "user_id" TEXT,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "bet" ALTER COLUMN "group_id" SET NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "option" DROP COLUMN "finalOption",
ADD COLUMN     "is_final_option" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user_group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "wager" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- CreateTable
CREATE TABLE "friend" (
    "friender_id" TEXT NOT NULL,
    "friended_id" TEXT NOT NULL,
    "id" TEXT NOT NULL DEFAULT gen_random_uuid (),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friend_request" (
    "user_to_id" TEXT NOT NULL,
    "user_from_id" TEXT NOT NULL,
    "id" TEXT NOT NULL DEFAULT gen_random_uuid (),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "friend_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_friender_id_fkey" FOREIGN KEY ("friender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend" ADD CONSTRAINT "friend_friended_id_fkey" FOREIGN KEY ("friended_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_user_to_id_fkey" FOREIGN KEY ("user_to_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_user_from_id_fkey" FOREIGN KEY ("user_from_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
