'use server';
import { Backtest, TradeStatus } from '@prisma/client';
import { array, date, mixed, number, object, string } from 'yup';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

const symbolSchema = object().shape({
  id: string().required(),
});

const tradeSchema = object().shape({
  entry: number().required(),
  takeProfit: number().required(),
  stopLoss: number().optional(),
  entryTime: date().optional(),
  exitTime: date().optional(),
  status: mixed<TradeStatus>().oneOf(Object.values(TradeStatus)).required(),
  symbolId: string().required(),
});

const strategySchema = object().shape({
  id: string().required(),
});

const backtestSchema = object().shape({
  to: date().required(),
  from: date().required(),
  finalWalletAmount: number().required(),
  initialWalletAmount: number().required(),
  timeperiod: string().required(),
  trades: array()
    .of(tradeSchema)
    .transform((value) => value || [])
    .required(),
  strategy: strategySchema,
  symbol: symbolSchema,
});

export default async function createBacktest(backtest: Backtest) {
  console.log('Creating backtest');

  const data = await backtestSchema.validate(backtest);

  console.log('Validated backtest data:', data);

  return await prisma.backtest.create({
    data: {
      ...data,
      symbol: {
        create: data.symbol,
      },
      strategy: {
        create: data.strategy,
      },
      trades: {
        createMany: {
          data: data.trades,
        },
      },
    },
  });
}
