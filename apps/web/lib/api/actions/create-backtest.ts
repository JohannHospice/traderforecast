'use server';
import { prisma } from '@traderforecast/database';
import {
  CreateBacktestAction,
  createBacktestActionSchema,
} from '../../validation/backtest-database';

export default async function createBacktest(data: CreateBacktestAction) {
  console.log('Validated backtest data');

  const { backtest, strategy, symbol, trades } =
    await createBacktestActionSchema.validate(data);

  console.log('Creating backtest');
  console.log({ backtest, strategy, symbol, trades: trades.length });

  return await prisma.backtest.create({
    data: {
      ...backtest,
      symbol: {
        connectOrCreate: {
          where: {
            id: symbol.id,
          },
          create: symbol,
        },
      },
      strategy: {
        connectOrCreate: {
          where: {
            id: strategy.id,
          },
          create: strategy,
        },
      },
      trades: {
        createMany: {
          data: trades,
        },
      },
    },
  });
}
