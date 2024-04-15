import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { prisma } from '@traderforecast/database';
import {
  format,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { PriceTitle } from '../../../components/price-title';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { formatNumber } from '../../../lib/helpers/string';
import { ProfitLossTypography } from './components/profit-loss-typography';
import { TradesDataTable } from './components/trades-data-table';

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
      settings: true,
      symbol: {
        select: {
          id: true,
          createdAt: true,
        },
      },
      strategy: {
        select: {
          id: true,
          name: true,
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
          amount: true,
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
          <Card noBorder className='col-span-2 md:col-span-1 md:flex-col'>
            <CardHeader>
              <CardTitle>Backtest</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceTitle
                vertical
                title='Initial wallet amount'
                value={formatNumber(backtests.initialWalletAmount, 'standard')}
              />
              <PriceTitle
                vertical
                title='Final wallet amount'
                value={formatNumber(backtests.finalWalletAmount, 'standard')}
              />
              <PriceTitle
                vertical
                title='Profit/Loss'
                value={
                  <ProfitLossTypography
                    value={
                      backtests.finalWalletAmount -
                      backtests.initialWalletAmount
                    }
                  />
                }
              />
              <PriceTitle
                vertical
                title='Profit/Loss %'
                value={
                  <ProfitLossTypography
                    value={
                      (backtests.finalWalletAmount -
                        backtests.initialWalletAmount) /
                      backtests.initialWalletAmount
                    }
                    percentage
                  />
                }
              />
              <PriceTitle
                vertical
                title='Created at'
                value={formatDistanceToNowStrict(backtests.createdAt, {
                  addSuffix: true,
                })}
              />
            </CardContent>
          </Card>
          <Card
            noBorder
            className='row-start-2 row-end-1 sm:row-end-2 flex-col md:flex'
          >
            <CardHeader>
              <CardTitle>Strategy settings</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceTitle
                vertical
                title='Strategy'
                value={backtests.strategy.name}
              />
              <PriceTitle title='Symbol' value={backtests.symbol.id} vertical />
              <PriceTitle
                vertical
                title='Duration'
                value={formatDistanceStrict(backtests.to, backtests.from)}
              />
              <PriceTitle
                vertical
                title='From'
                value={format(backtests.from, 'yyyy-MM-dd HH:mm')}
              />
              <PriceTitle
                vertical
                title='To'
                value={format(backtests.to, 'yyyy-MM-dd HH:mm')}
              />
              <PriceTitle
                vertical
                title='Parameters'
                value={
                  <pre className='text-sm bg-muted text-muted-foreground p-2 rounded-md'>
                    {JSON.stringify(backtests.settings, null, 2)}
                  </pre>
                }
              />
            </CardContent>
          </Card>
          <Card
            noBorder
            className='md:row-start-1 row-start-2 md:col-start-2 col-start-1 row-end-3 col-end-3 '
          >
            <TradesDataTable trades={backtests.trades} />
          </Card>
        </div>
      </Container>
    </>
  );
}
