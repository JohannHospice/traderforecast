import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prisma } from '@traderforecast/database';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BacktestDataTable } from './components/backtest-data-table';

export default async function Page() {
  const backtests = await prisma.backtest.findMany({
    select: {
      id: true,
      createdAt: true,
      from: true,
      to: true,
      initialWalletAmount: true,
      finalWalletAmount: true,
      timeperiod: true,
      _count: {
        select: {
          trades: true,
        },
      },
      strategy: {
        select: {
          id: true,
          name: true,
        },
      },
      symbol: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <>
      <Heading
        title='Backtesting'
        subtitle="Here's a list of latest backtests created"
      >
        <div className='flex justify-end flex-1'>
          <div>
            <Link href='/backtesting/create'>
              <Button color='primary' size='default' className='gap-2'>
                <Plus />
                Create backtest
              </Button>
            </Link>
          </div>
        </div>
      </Heading>
      <Container fluid className='flex-1'>
        {/* className='bg-card flex-1 flex flex-col sm:mx-0 mx-4 sm:mt-0 mt-4' */}
        <Card className='flex-1 flex'>
          <BacktestDataTable backtests={backtests} />
        </Card>
      </Container>
    </>
  );
}
