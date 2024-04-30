/*
  Warnings:

  - The values [CANCELLED] on the enum `TradeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
ALTER TYPE "TradeStatus" RENAME VALUE 'CANCELLED' TO 'OPEN_CANCELLED';
COMMIT;
