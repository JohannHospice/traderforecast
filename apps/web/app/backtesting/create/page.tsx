import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import api from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Backtesting } from './components/form-backtesting';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    symbol: string;
  };
}) {
  const symbols = await api.market.getSortedSymbols();

  return (
    <>
      <Heading
        title='Create a backtest'
        breadcrumbs={[
          {
            title: 'All Backtests',
            href: '/backtesting',
            icon: ArrowLeft,
          },
        ]}
      />
      <Container fluid className='flex-1'>
        <Backtesting
          symbols={symbols}
          defaultValues={{
            pair: searchParams.symbol,
          }}
        />
      </Container>
    </>
  );
}
