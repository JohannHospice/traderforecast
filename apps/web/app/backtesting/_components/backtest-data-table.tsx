'use client';

import { DataTable } from '@/components/data-table';
import { formatNumber } from '@/lib/helpers/string';
import { differenceInDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ProfitLossTypography } from '../[id]/_components/profit-loss-typography';

export function BacktestDataTable({ backtests }: { backtests: any[] }) {
  const router = useRouter();
  return (
    <DataTable
      className='flex-1 border-0'
      onRowClick={({ original }) => router.push('backtesting/' + original.id)}
      columns={[
        {
          header: 'Strategy',
          accessorKey: 'strategy',
          accessorFn: (row) => row.strategy.name,
        },
        {
          header: 'Symbol',
          accessorKey: 'symbol',
          accessorFn: (row) => row.symbol.id,
        },
        {
          header: 'Start date',
          accessorKey: 'from',
          accessorFn: (row) => format(row.from, 'yyyy-MM-dd HH:mm'),
        },
        {
          header: 'End date',
          accessorKey: 'to',
          accessorFn: (row) => format(row.to, 'yyyy-MM-dd HH:mm'),
        },
        {
          header: 'Final wallet amount',
          accessorKey: 'finalWalletAmount',
          accessorFn: (row) => formatNumber(row.finalWalletAmount),
        },
        {
          header: 'Profit/Loss',
          accessorKey: 'profitLoss',
          accessorFn: (row) => row.finalWalletAmount - row.initialWalletAmount,
          cell: ({ renderValue }) => (
            <ProfitLossTypography value={renderValue()} />
          ),
        },
        {
          header: 'Avg Profit/Loss per day %',
          accessorKey: 'profitLoss',
          id: 'avgProfitLossPerDay',
          accessorFn: (row) =>
            (row.finalWalletAmount - row.initialWalletAmount) /
            row.initialWalletAmount /
            differenceInDays(row.to, row.from),
          cell: ({ renderValue }) => (
            <ProfitLossTypography value={renderValue()} percentage />
          ),
        },
        {
          header: 'Trades',
          accessorKey: 'trades',
          accessorFn: (row) => row._count.trades,
        },
      ]}
      data={backtests}
    />
  );
}
