'use server';
import {
  Prisma,
  TradeStatus,
  TradeType,
  prisma,
} from '@traderforecast/database';
import { Infer } from 'next/dist/compiled/superstruct';
import {
  InferType,
  Schema,
  array,
  date,
  mixed,
  number,
  object,
  string,
} from 'yup';

export default async function createBacktest(data: Input) {
  console.log('Validated backtest data:', data);

  const trades = await tradeSchema.validate(data.trades);
  const strategy = await strategySchema.validate(data.strategy);
  const symbol = await symbolSchema.validate(data.symbol);
  const backtest = await backtestSchema.validate(data);

  console.log('Creating backtest');

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
          data: {
            ...trades,
            symbolId: symbol.id,
          },
        },
      },
    },
  });
}

const strategySchema = object().shape({
  id: string().required(),
}) satisfies Schema<Prisma.StrategyCreateWithoutBacktestsInput>;

const symbolSchema = object().shape({
  id: string().required(),
}) satisfies Schema<Prisma.SymbolCreateWithoutBacktestsInput>;

const tradeSchema = object().shape({
  entry: number().required(),
  takeProfit: number().required(),
  stopLoss: number().optional(),
  entryTime: date().optional(),
  exitTime: date().optional(),
  status: mixed<TradeStatus>().oneOf(Object.values(TradeStatus)).required(),
  symbolId: string().required(),
  type: mixed<TradeType>().oneOf(Object.values(TradeType)).required(),
  profitLoss: number().optional(),
}) satisfies Schema<Prisma.TradeCreateWithoutSymbolInput>;

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
}) satisfies Schema<
  Omit<Prisma.BacktestCreateInput, 'strategy' | 'symbol' | 'trades'>
>;

type Input = InferType<typeof backtestSchema> & {
  symbol: InferType<typeof symbolSchema>;
  strategy: InferType<typeof strategySchema>;
  trades: InferType<typeof tradeSchema>[];
};
