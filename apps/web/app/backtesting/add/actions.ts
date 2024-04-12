'use server';
import { array, date, mixed, number, object, string } from 'yup';
import { Backtester } from '../../../lib/modules/backtest/backtester';
import prisma from '../../../lib/prisma';
import { TradeStatus } from '@prisma/client';

const symbolSchema = object().shape({
  name: string().required(),
});

const tradeSchema = object().shape({
  entry: number().required(),
  stopLoss: number().required(),
  takeProfit: number().required(),
  entryTime: date().required(),
  exitTime: date().required(),
  status: mixed<TradeStatus>().oneOf(Object.values(TradeStatus)).required(),
  symbol: symbolSchema,
});
const strategySchema = object().shape({
  name: string().required(),
});

const backtestSchema = object().shape({
  to: date().required(),
  from: date().required(),
  finalWalletAmount: number().required(),
  initialWalletAmount: number().required(),
  timeperiod: string().required(),
  createdAt: date().required(),
  trades: array().of(tradeSchema),
  strategy: strategySchema,
  symbol: symbolSchema,
});

export default async function createBacktest(backtest: Backtester) {
  const data = backtestSchema.validateSync(backtest);

  prisma.backtest.create({
    data,
  });
}
