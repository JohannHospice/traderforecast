'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SEARCH_PARAMS_LIST_SYMBOLS } from '@/app/constants/navigation';
import { useRedirectWithSearchParams } from '@/lib/hooks/useRedirectWithSearchParams';
import { Input } from './ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

export function Navigation() {
  const pathname = usePathname();
  const { redirectWithSearchParams, searchParams } =
    useRedirectWithSearchParams();
  const { setTheme, theme } = useTheme();

  return (
    <nav className='p-2 border-b-[1px] '>
      <div className='flex justify-between'>
        <div className='flex gap-4'>
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
          <div className='relative'>
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

        <Button
          variant='outline'
          size='icon'
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </div>
    </nav>
  );
}
