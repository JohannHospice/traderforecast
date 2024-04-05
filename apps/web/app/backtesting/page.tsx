import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import api from '../../lib/api';
import { Backtesting } from './components/form-backtesting';

export default async function Page() {
  const symbols = await api.market.getSortedSymbols();

  return (
    <>
      <Heading
        title='Backtesting'
        subtitle="Here's the backtesting page, where you can test your strategies."
      />
      <Container fluid className='flex-1'>
        <Backtesting symbols={symbols} />
      </Container>
    </>
  );
}
