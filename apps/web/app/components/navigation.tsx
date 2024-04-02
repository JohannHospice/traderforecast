'use client';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/tailwind/utils';

// FIXME: This is a workaround to fix hydration and incoherence between client and server
const NavigationLogo = dynamic(() => import('./navigation-logo'), {
  ssr: false,
});

export function Navigation() {
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className='py-2 border-b-[1px] mb-8 sticky top-0 w-full bg-card/60 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/60'>
      <Container noMargin>
        <div className='flex justify-between relative'>
          <Link href='/' passHref>
            <NavigationLogo />
          </Link>
          <NavigationMenu className='absolute mx-auto top-0 left-0 right-0'>
            <NavigationMenuList className='gap-4'>
              <NavigationMenuItem>
                <Link href='/' passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent data-[active]:bg-accent'
                    )}
                    active={pathname.includes('/market') || pathname === '/'}
                  >
                    Market
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href='/backtesting' passHref legacyBehavior>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      'bg-transparent data-[active]:bg-accent'
                    )}
                    active={pathname === '/backtesting'}
                  >
                    Backtesting
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
            <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
            <span className='sr-only'>Toggle theme</span>
          </Button>
        </div>
      </Container>
    </nav>
  );
}
