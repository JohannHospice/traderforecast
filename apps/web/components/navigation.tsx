'use client';
import { Container } from '@/components/container';
import { NavigationButton } from '@/components/navigation-button';
import { ThemeButton } from '@/components/theme-button';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import NavigationLogo from './navigation-logo';

export function Navigation() {
  return (
    // backdrop-blur supports-[backdrop-filter]:bg-card/60 bg-card/60 border-b-[1px]
    <nav className='py-2 mb-8 sticky top-0 w-full z-50 '>
      <Container noMargin>
        <div className='flex justify-between relative'>
          <NavigationLogo />
          <div className='flex gap-4'>
            <NavigationMenu>
              {/* className='absolute mx-auto top-0 left-0 right-0'> */}
              <NavigationMenuList className='gap-4'>
                <NavigationButton href='/market'>Market</NavigationButton>
                <NavigationButton href='/backtesting'>
                  Backtesting
                </NavigationButton>
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeButton />
          </div>
        </div>
      </Container>
    </nav>
  );
}
