'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';

export function Navigation({ symbol }: { symbol?: string }) {
  const router = useRouter();
  return (
    <nav className='p-2 border-b-[1px]'>
      <div className='relative flex'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='flex w-full max-w-sm items-center space-x-2 absolute left-0 right-0 mx-auto'>
          <Input
            type='symbol'
            placeholder='Symbol'
            defaultValue={symbol || ''}
            onChange={(e) => router.replace(`/?q=${e.target.value}`)}
          />
        </div>
      </div>
    </nav>
  );
}
