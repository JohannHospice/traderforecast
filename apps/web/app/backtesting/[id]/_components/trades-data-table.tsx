'use client';
import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/helpers/string';
import { cn } from '@/lib/helpers/tailwind-utils';
import { $Enums } from '@traderforecast/database';
import { format } from 'date-fns';
import { ProfitLossTypography } from './profit-loss-typography';

const colors = {
  [$Enums.TradeStatus.AWAIT]:
    'bg-blue-500 hover:bg-bg-blue-500 text-primary-foreground',
  [$Enums.TradeStatus.OPEN]:
    'bg-yellow-500 hover:bg-yellow-500 text-foreground',
  [$Enums.TradeStatus.SUCCESS]:
    'bg-green-500 hover:bg-green-500 text-primary-foreground',
  [$Enums.TradeStatus.FAILED]:
    'bg-red-500 hover:bg-red-500 text-primary-foreground',
  [$Enums.TradeStatus.CANCELLED]:
    'bg-muted hover:bg-muted text-muted-foreground',
  undefined: 'bg-gray-500 hover:bg-gray-500 text-foreground',
};

export function TradesDataTable({
  trades,
  className,
}: {
  trades: {
    id: string;
    entry: number;
    stopLoss: number | null;
    takeProfit: number;
    entryTime: Date | null;
    exitTime: Date | null;
    status: $Enums.TradeStatus;
    type: $Enums.TradeType;
    profitLoss: number | null;
    amount: number;
  }[];
  className?: string;
}) {
  return (
    <DataTable
      className={cn('flex-1 border-0', className)}
      data={trades}
      columns={[
        {
          header: 'Status',
          accessorKey: 'status',
          cell: ({ renderValue }) => {
            const value = renderValue<$Enums.TradeStatus>();
            return <Badge className={colors[value]}>{value}</Badge>;
          },
        },
        {
          header: 'Type',
          accessorKey: 'type',
        },
        {
          header: 'Amount',
          accessorKey: 'amount',
          accessorFn: (row) => formatNumber(row.amount * row.entry),
        },
        {
          header: 'Entry',
          accessorKey: 'entry',
          accessorFn: (row) => formatNumber(row.entry),
        },
        {
          header: 'Take Profit',
          accessorKey: 'takeProfit',
          accessorFn: (row) => formatNumber(row.takeProfit),
        },
        {
          header: 'Stop Loss',
          accessorKey: 'stopLoss',
          accessorFn: (row) =>
            row.stopLoss ? formatNumber(row.stopLoss) : 'N/A',
        },
        {
          header: 'Profit/Loss',
          accessorKey: 'profitLoss',
          cell: ({ renderValue }) => (
            <ProfitLossTypography value={renderValue()} />
          ),
        },
        {
          id: 'profitLossPercentage',
          header: 'Profit/Loss %',
          accessorFn: (row) =>
            row.profitLoss ? row.profitLoss / (row.amount * row.entry) : null,
          cell: ({ getValue }) => (
            <ProfitLossTypography value={getValue()} percentage />
          ),
        },
        {
          header: 'Entry Time',
          accessorKey: 'entryTime',
          accessorFn: (row) =>
            row.entryTime ? format(row.entryTime, 'yyyy-MM-dd HH:mm') : 'N/A',
        },
        {
          header: 'Exit Time',
          accessorKey: 'exitTime',
          accessorFn: (row) =>
            row.exitTime ? format(row.exitTime, 'yyyy-MM-dd HH:mm') : 'N/A',
        },
      ]}
    />
  );
}
