/*
  Warnings:

  - You are about to drop the column `bet_id` on the `category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bet_id]` on the table `bet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bet_id` to the `bet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `group_id` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_bet_id_fkey";

-- DropIndex
DROP INDEX "category_bet_id_key";

-- AlterTable
ALTER TABLE "audit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "bet" ADD COLUMN     "bet_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "category" DROP COLUMN "bet_id",
ADD COLUMN     "group_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

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
CREATE UNIQUE INDEX "bet_bet_id_key" ON "bet"("bet_id");

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
