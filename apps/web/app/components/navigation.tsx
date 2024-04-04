'use client';
import { Container } from '@/components/container';
import { NavigationButton } from '@/components/navigation-button';
import { ThemeButton } from '@/components/theme-button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import dynamic from 'next/dynamic';

// FIXME: This is a workaround to fix hydration and incoherence between client and server
const NavigationLogo = dynamic(() => import('./navigation-logo'), {
  ssr: false,
});

export function Navigation() {
  return (
    <nav className='py-2 border-b-[1px] mb-8 sticky top-0 w-full bg-card/60 z-50 backdrop-blur supports-[backdrop-filter]:bg-card/60'>
      <Container noMargin>
        <div className='flex justify-between relative'>
          <NavigationLogo />
          <NavigationMenu className='absolute mx-auto top-0 left-0 right-0'>
            <NavigationMenuList className='gap-4'>
              <NavigationButton href='/market'>Market</NavigationButton>
              <NavigationButton href='/backtesting'>
                Backtesting
              </NavigationButton>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeButton />
        </div>
      </Container>
    </nav>
  );
}
