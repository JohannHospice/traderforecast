export function Container({
  children,
  fluid,
  className,
  contained,
}: {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
  contained?: boolean;
}) {
  return (
    <div
      className={
        'flex flex-col gap-4 w-full  mx-auto mb-0 sm:mb-8 ' +
        (fluid ? ' px-0 sm:px-8' : ' px-4 sm:px-8') +
        ' ' +
        (contained ? 'max-w-7xl' : '') +
        className
      }
    >
      {children}
    </div>
  );
}
