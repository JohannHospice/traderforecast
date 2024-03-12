'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SEARCH_PARAMS_LIST_SYMBOLS } from '@/app/constants';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { Input } from './ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export function Navigation() {
  const pathname = usePathname();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
    <nav className='p-2 border-b-[1px] bg-white'>
      <div className=' flex gap-4'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  active={pathname === '/'}
                >
                  Market
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='relative '>
          <MagnifyingGlassIcon className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            className='w-full max-w-[400px] pl-8'
            type='symbol'
            placeholder='Search'
            defaultValue={
              searchParams.get(SEARCH_PARAMS_LIST_SYMBOLS.QUERY) || ''
            }
            onChange={(e) => {
              redirectWithSearchParams(
                {
                  [SEARCH_PARAMS_LIST_SYMBOLS.QUERY]: e.target.value,
                },
                '/'
              );
            }}
          />
        </div>
      </div>
    </nav>
  );
}
