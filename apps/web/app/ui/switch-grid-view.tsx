'use client';

import { GridIcon, TableIcon } from '@radix-ui/react-icons';
import { Button } from '../../components/ui/button';
import { useRedirectWithSearchParams } from '../../lib/hooks/useRedirectWithSearchParams';
import { SEARCH_PARAMS_LIST_SYMBOLS, SYMBOL_VIEWS } from '../constants';

export function SwitchGridView() {
  const { searchParams, redirectWithSearchParams } =
    useRedirectWithSearchParams();
  const isGrid = searchParams.get('t') === SYMBOL_VIEWS.GRID;
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => {
        redirectWithSearchParams({
          [SEARCH_PARAMS_LIST_SYMBOLS.VIEWS]: isGrid
            ? SYMBOL_VIEWS.TABLE
            : SYMBOL_VIEWS.GRID,
        });
      }}
    >
      {isGrid ? (
        <GridIcon className='h-4 w-4' />
      ) : (
        <TableIcon className='h-4 w-4' />
      )}
    </Button>
  );
}
