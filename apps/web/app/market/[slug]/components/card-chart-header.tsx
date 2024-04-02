'use client';
import { GroupButton } from '@/components/group-button';
import { SEARCH_PARAMS } from '@/lib/constants/navigation';
import { getNumberOfKlinesResponsive } from '@/lib/helpers/klines';
import { formatInterval } from '@/lib/helpers/utc';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import {
  HamburgerMenuIcon,
  LockClosedIcon,
  LockOpen2Icon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { CommandDialog } from '../../../../components/ui/command';
import { useChartSettings } from '../../../../lib/contexts/chart-settings-context';
import { CommandChartSettings } from './command-chart-settings';

export function CardChartHeader({ intervals = [] }: { intervals?: string[] }) {
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  const [open, setOpen] = useState(false);
  const { lock, setLock } = useChartSettings();
  return (
    <>
      <div className='flex gap-4 flex-wrap justify-between'>
        <div className='flex gap-4'>
          <GroupButton
            defaultValue={searchParams.get(SEARCH_PARAMS.INTERVAL)}
            tabs={intervals.map((interval, i) => ({
              value: interval,
              label: interval.toUpperCase(),
              onClick: () => {
                redirectWithSearchParams(
                  {
                    [SEARCH_PARAMS.START_TIME]: formatInterval(
                      interval,
                      getNumberOfKlinesResponsive()
                    ),
                    [SEARCH_PARAMS.INTERVAL]: interval,
                  },
                  {
                    scroll: false,
                  }
                );
              },
            }))}
          />
          <Button variant='ghost' size='icon' onClick={() => setLock(!lock)}>
            {lock ? (
              <LockClosedIcon className='h-[1.2rem] w-[1.2rem]' />
            ) : (
              <LockOpen2Icon className='h-[1.2rem] w-[1.2rem]' />
            )}
          </Button>
        </div>
        <Button
          className='md:hidden'
          variant='ghost'
          size='icon'
          onClick={() => setOpen(true)}
        >
          <HamburgerMenuIcon className='h-[1.2rem] w-[1.2rem]' />
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={(open) => setOpen(open)}>
        <CommandChartSettings />
      </CommandDialog>
    </>
  );
}
