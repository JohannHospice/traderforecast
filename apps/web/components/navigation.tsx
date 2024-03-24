'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { Suspense } from 'react';
import { InputQuery } from './input-query';

export function Navigation() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <nav className='p-2 border-b-[1px] mb-8 sticky top-0 w-full bg-background z-50'>
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
            <Suspense>
              <InputQuery />
            </Suspense>
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
