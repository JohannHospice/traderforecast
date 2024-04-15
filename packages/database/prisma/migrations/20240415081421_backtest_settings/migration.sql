/*
  Warnings:

  - Added the required column `settings` to the `Backtest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Strategy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `settings` to the `Strategy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Backtest" ADD COLUMN     "settings" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Strategy" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "settings" JSONB NOT NULL;
