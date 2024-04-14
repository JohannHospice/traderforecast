'use server';
import {
  Prisma,
  TradeStatus,
  TradeType,
  prisma,
} from '@traderforecast/database';
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

export default async function createBacktest(data: CreateBacktestAction) {
  console.log('Validated backtest data:', data);

  const { backtest, strategy, symbol, trades } =
    await createBacktestActionSchema.validate(data);

  console.log('Creating backtest');
  console.log({ backtest, strategy, symbol, trades });

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
  profitLoss: number().optional(),
  entryTime: date().optional(),
  exitTime: date().optional(),
  symbolId: string().required(),
  status: mixed<TradeStatus>().oneOf(Object.values(TradeStatus)).required(),
  type: mixed<TradeType>().oneOf(Object.values(TradeType)).required(),
}) satisfies Schema<Prisma.TradeCreateWithoutSymbolInput>;

const backtestSchema = object().shape({
  to: date().required(),
  from: date().required(),
  finalWalletAmount: number().required(),
  initialWalletAmount: number().required(),
  timeperiod: string().required(),
}) satisfies Schema<
  Omit<Prisma.BacktestCreateInput, 'strategy' | 'symbol' | 'trades'>
>;

const createBacktestActionSchema = object().shape({
  backtest: backtestSchema,
  symbol: symbolSchema,
  strategy: strategySchema,
  trades: array()
    .of(tradeSchema)
    .transform((value) => value || [])
    .required(),
});

export type CreateBacktestAction = InferType<typeof createBacktestActionSchema>;
