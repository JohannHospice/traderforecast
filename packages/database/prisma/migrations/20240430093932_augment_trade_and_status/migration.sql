-- AlterEnum
ALTER TYPE "TradeStatus" ADD VALUE 'AWAIT_CANCELLED';

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "creationTime" TIMESTAMP(3);
