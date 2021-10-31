/*
  Warnings:

  - You are about to drop the column `bet_id` on the `bet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category_id]` on the table `bet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `bet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bet" DROP CONSTRAINT "bet_bet_id_fkey";

-- DropForeignKey
ALTER TABLE "bet" DROP CONSTRAINT "bet_group_id_fkey";

-- DropIndex
DROP INDEX "bet_bet_id_key";

-- AlterTable
ALTER TABLE "audit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "bet" DROP COLUMN "bet_id",
ADD COLUMN     "category_id" TEXT NOT NULL,
ALTER COLUMN "group_id" DROP NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "category" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "option" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user_group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "wager" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- CreateIndex
CREATE UNIQUE INDEX "bet_category_id_key" ON "bet"("category_id");

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
