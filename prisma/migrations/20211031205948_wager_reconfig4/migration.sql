-- DropForeignKey
ALTER TABLE "bet" DROP CONSTRAINT "bet_category_id_fkey";

-- AlterTable
ALTER TABLE "audit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "bet" ALTER COLUMN "id" SET DEFAULT gen_random_uuid (),
ALTER COLUMN "category_id" DROP NOT NULL;

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

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
