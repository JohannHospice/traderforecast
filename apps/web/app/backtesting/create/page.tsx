import { Container } from '@/components/container';
import { BacktestingForm } from '@/components/forms/backtesting-form';
import { Heading } from '@/components/heading';
import api from '@/lib/api/dependancies';
import { ArrowLeft } from 'lucide-react';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    symbol: string;
  };
}) {
  const symbols = await api.market.getSymbolsSorted();

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
        <BacktestingForm
          symbols={symbols}
          defaultValues={{
            pair: searchParams.symbol,
          }}
        />
      </Container>
    </>
  );
}
