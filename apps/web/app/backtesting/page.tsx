import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { BacktestDataTable } from './components/backtest-data-table';

export default async function Page() {
  const backtests = await prisma.backtest.findMany({
    include: {
      trades: true,
      strategy: true,
      symbol: true,
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
      <Container fluid className='flex-1 gap-8'>
        <BacktestDataTable backtests={backtests} />
      </Container>
    </>
  );
}
