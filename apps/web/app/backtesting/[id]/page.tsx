import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { prisma } from '@traderforecast/database';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { PriceTitle } from '../../../components/price-title';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { formatNumber } from '../../../lib/helpers/string';
import { TradesTableCard } from './components/trades-table-card';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const backtests = await prisma.backtest.findFirstOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      createdAt: true,
      to: true,
      from: true,
      initialWalletAmount: true,
      finalWalletAmount: true,
      timeperiod: true,
      symbol: {
        select: {
          id: true,
          createdAt: true,
        },
      },
      strategy: {
        select: {
          id: true,
          createdAt: true,
        },
      },
      trades: {
        select: {
          id: true,
          entry: true,
          takeProfit: true,
          stopLoss: true,
          exitTime: true,
          status: true,
          entryTime: true,
          profitLoss: true,
          type: true,
        },
      },
    },
  });

  return (
    <>
      <Heading
        title='Backtesting'
        breadcrumbs={[
          {
            title: 'All Backtests',
            href: '/backtesting',
            icon: ArrowLeft,
          },
          {
            title: backtests.id,
          },
        ]}
      />
      <Container fluid className='flex-1 gap-8'>
        <div className='grid grid-cols-[270px_1fr] grid-rows-[auto_1fr] gap-4 gap-y-0 sm:gap-y-4 flex-1'>
          <Card className='col-span-2 md:col-span-1 md:flex-col'>
            <CardHeader>
              <CardTitle>Backtest</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceTitle
                title='Initial wallet amount'
                value={formatNumber(backtests.initialWalletAmount, 'standard')}
                vertical
              />
              <PriceTitle
                title='Final wallet amount'
                value={formatNumber(backtests.finalWalletAmount, 'standard')}
                vertical
              />
              <PriceTitle
                title='From'
                value={format(backtests.from, 'yyyy-MM-dd HH:mm')}
                vertical
              />
              <PriceTitle
                title='To'
                value={format(backtests.to, 'yyyy-MM-dd HH:mm')}
                vertical
              />
              <PriceTitle
                title='Created at'
                value={format(backtests.createdAt, 'yyyy-MM-dd HH:mm')}
                vertical
              />
            </CardContent>
          </Card>
          <Card className='row-start-2 row-end-3 flex-col md:flex'>
            <CardHeader>
              <CardTitle>Strategy settings</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceTitle
                title='Strategy ID'
                value={backtests.strategy.id}
                vertical
              />
              <PriceTitle
                title='Time period'
                value={backtests.timeperiod}
                vertical
              />
              <PriceTitle title='Symbol' value={backtests.symbol.id} vertical />
            </CardContent>
          </Card>
          <TradesTableCard
            trades={backtests.trades}
            className='md:row-start-1 row-start-2 md:col-start-2 col-start-1 row-end-3 col-end-3 flex sm:border-t-0 border-t-[1px]'
          />
        </div>
      </Container>
    </>
  );
}
// row-span-2 col-start-2 row-start-1
