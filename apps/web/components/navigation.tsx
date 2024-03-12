'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SEARCH_PARAMS_LIST_SYMBOLS } from '@/app/constants';
import { useRedirectWithSearchParams } from '../lib/hooks/useRedirectWithSearchParams';
import { Input } from './ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();

  return (
    <nav className='p-2 border-b-[1px] bg-white'>
      <div className='relative flex'>
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
        <div className='flex w-full max-w-sm items-center space-x-2 absolute left-0 right-0 mx-auto'>
          <Input
            type='symbol'
            placeholder='Symbol'
            defaultValue={
              searchParams.get(SEARCH_PARAMS_LIST_SYMBOLS.QUERY) || ''
            }
            onChange={(e) => {
              redirectWithSearchParams({
                [SEARCH_PARAMS_LIST_SYMBOLS.QUERY]: e.target.value,
              });
            }}
          />
        </div>
      </div>
    </nav>
  );
}
