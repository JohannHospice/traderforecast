import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Rabbit } from 'lucide-react';
import * as React from 'react';
import { SettingCard } from './components/setting-card';

/**
 * The backtesting page offer to the user the execution of multiple strategies and results of those strategies.
 * The user have to enter some parameters:
 * - The strategy to backtest
 * - The start and end date to backtest
 * - The time period(s) to backtest multiple periods can be selected (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w)
 * - The symbol to backtest
 * - The amount of money to backtest in the wallet
 *
 */
export default function Page() {
  const strategies = [
    {
      value: 'fvg-in-fvg',
      icon: Rabbit,
      title: 'Fair Value Gap',
      titleBold: 'In Fair Value Gap',
      description: 'Our first and most popular strategy.',
    },
  ];

  return (
    <>
      <Heading
        title='Backtesting'
        subtitle="Here's the backtesting page, where you can test your strategies."
      />
      <Container fluid className='flex-1 flex-col md:flex-row '>
        <form action=''>
          <SettingCard strategies={strategies} />
        </form>
        <Card className='relative flex-1 flex min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4'>
          <Badge variant='outline' className='absolute right-3 top-3'>
            Output
          </Badge>
          <div className='flex-1' />
        </Card>
      </Container>
    </>
  );
}
