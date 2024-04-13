import { CardPreCode } from '@/components/card-pre-code';
import { Container } from '@/components/container';
import { Heading } from '@/components/heading';
import prisma from '@/lib/prisma';
import { ArrowLeft } from 'lucide-react';

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
        <CardPreCode data={backtests} />
      </Container>
    </>
  );
}
