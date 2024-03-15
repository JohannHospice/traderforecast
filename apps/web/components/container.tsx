export function Container({
  children,
  fluid,
  className,
}: {
  children: React.ReactNode;
  fluid?: boolean;
  className?: string;
}) {
  return (
    <div
      className={
        'flex flex-col gap-4 w-full max-w-7xl mx-auto mb-0 sm:mb-8 ' +
        (fluid ? ' px-0 sm:px-8' : ' px-4 sm:px-8') +
        ' ' +
        className
      }
    >
      {children}
    </div>
  );
}
