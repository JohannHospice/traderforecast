import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import api from '@/lib/api';
import { Backtesting } from './components/form-backtesting';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
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
        <Backtesting symbols={symbols} />
      </Container>
    </>
  );
}
