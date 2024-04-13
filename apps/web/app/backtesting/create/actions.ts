'use server';
import { Backtest, TradeStatus, prisma } from '@traderforecast/database';
import { array, date, mixed, number, object, string } from 'yup';

export default async function createBacktest(backtest: Backtest) {
  console.log('Creating backtest');

  const data = await backtestSchema.validate(backtest);

  console.log('Validated backtest data:', data);

  return await prisma.backtest.create({
    data: {
      ...data,
      symbol: {
        connectOrCreate: {
          where: {
            id: data.symbol.id,
          },
          create: data.symbol,
        },
      },
      strategy: {
        connectOrCreate: {
          where: {
            id: data.strategy.id,
          },
          create: data.strategy,
        },
      },
      trades: {
        createMany: {
          data: data.trades,
        },
      },
    },
  });
}

const strategySchema = object().shape({
  id: string().required(),
});

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
