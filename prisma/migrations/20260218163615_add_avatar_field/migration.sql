-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT,
ALTER COLUMN "preferredCurrency" SET DEFAULT ARRAY['USD']::TEXT[];
