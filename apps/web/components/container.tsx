import { cn } from '@/lib/tailwind/utils';

export function Container({
  children,
  fluid,
  className,
  contained,
  noMargin,
}: {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
  contained?: boolean;
  noMargin?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 w-full mx-auto',
        fluid ? 'px-0 sm:px-8' : 'px-4 sm:px-8',
        contained ? 'max-w-7xl' : '',
        noMargin ? 'my-0' : 'mb-0 sm:mb-8 ',
        className
      )}
    >
      {children}
    </div>
  );
}
