'use client';
import { Button } from '../../../../components/ui/button';
import { useSearchParams } from 'next/navigation';
import { useRedirectWithSearchParams } from '../../../../lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS_SYMBOL } from '../page';

import {
  Menubar,
  MenubarShortcut,
  MenubarMenu,
  MenubarTrigger,
} from '../../../../components/ui/menubar';

export function IntervalNav() {
  const searchParams = useSearchParams();
  const { redirectWithSearchParams } = useRedirectWithSearchParams();
  return (
    <div className=' flex self-start'>
      <Menubar>
        {INTERVAL.map((interval, i) => (
          <MenubarMenu key={interval}>
            <MenubarTrigger
              value={
                interval === searchParams.get('i') ? 'default' : 'secondary'
              }
              onClick={() => {
                redirectWithSearchParams({
                  [SEARCH_PARAMS_SYMBOL.START_TIME]: START_TIMES[i],
                  [SEARCH_PARAMS_SYMBOL.INTERVAL]: interval,
                });
              }}
              data-highlighted={interval === searchParams.get('i')}
            >
              {interval.toUpperCase()}
            </MenubarTrigger>
          </MenubarMenu>
        ))}
      </Menubar>
    </div>
  );
  return (
    <nav className='border-[1px] rounded-sm p-1 gap-1 flex self-start'>
      {INTERVAL.map((interval, i) => (
        <Button
          key={interval}
          variant={interval === searchParams.get('i') ? 'default' : 'secondary'}
          onClick={() => {
            redirectWithSearchParams({
              [SEARCH_PARAMS_SYMBOL.START_TIME]: START_TIMES[i],
              [SEARCH_PARAMS_SYMBOL.INTERVAL]: interval,
            });
          }}
        >
          {interval.toUpperCase()}
        </Button>
      ))}
    </nav>
  );
}

const expectedKlines = 365;
const INTERVAL = ['1h', '4h', '1d', '1w'];
const START_TIMES = INTERVAL.map(
  (interval) => `utc_now-${Number(interval[0]) * expectedKlines}${interval[1]}`
);
