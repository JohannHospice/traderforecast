'use server';
import { Prisma, TradeStatus, TradeType } from '@traderforecast/database';
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

const strategySchema = object().shape({
  id: string().required(),
  name: string().required(),
  settings: mixed().required(),
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
  amount: number().required(),
}) satisfies Schema<Prisma.TradeCreateWithoutSymbolInput>;
const backtestSchema = object().shape({
  to: date().required(),
  from: date().required(),
  finalWalletAmount: number().required(),
  initialWalletAmount: number().required(),
  timeperiod: string().required(),
  settings: mixed().required(),
}) satisfies Schema<
  Omit<Prisma.BacktestCreateInput, 'strategy' | 'symbol' | 'trades'>
>;
export const createBacktestActionSchema = object().shape({
  backtest: backtestSchema,
  symbol: symbolSchema,
  strategy: strategySchema,
  trades: array()
    .of(tradeSchema)
    .transform((value) => value || [])
    .required(),
});

export type CreateBacktestAction = InferType<typeof createBacktestActionSchema>;
