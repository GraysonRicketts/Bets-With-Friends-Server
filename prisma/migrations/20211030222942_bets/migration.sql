-- AlterTable
ALTER TABLE "audit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- AlterTable
ALTER TABLE "user_group" ALTER COLUMN "id" SET DEFAULT gen_random_uuid ();

-- CreateTable
CREATE TABLE "bet" (
    "title" TEXT NOT NULL,
    "closed_at" TIMESTAMPTZ(3),
    "closed_by_id" TEXT,
    "group_id" TEXT NOT NULL,
    "id" TEXT NOT NULL DEFAULT gen_random_uuid (),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "name" TEXT NOT NULL,
    "bet_id" TEXT NOT NULL,
    "finalOption" BOOLEAN NOT NULL DEFAULT false,
    "id" TEXT NOT NULL DEFAULT gen_random_uuid (),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "name" TEXT NOT NULL,
    "bet_id" TEXT NOT NULL,
    "id" TEXT NOT NULL DEFAULT gen_random_uuid (),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "category_bet_id_key" ON "category"("bet_id");

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bet" ADD CONSTRAINT "bet_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_bet_id_fkey" FOREIGN KEY ("bet_id") REFERENCES "bet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
