/*
  Warnings:

  - You are about to drop the column `name` on the `Symbol` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_backtestId_fkey";

-- AlterTable
ALTER TABLE "Symbol" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Trade" ALTER COLUMN "stopLoss" DROP NOT NULL,
ALTER COLUMN "backtestId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_backtestId_fkey" FOREIGN KEY ("backtestId") REFERENCES "Backtest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
