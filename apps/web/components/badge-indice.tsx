export function BadgeIndice({ children }: { children: React.ReactNode }) {
  return (
    <span className='flex items-center justify-center border-2 text-xs w-8 rounded-sm'>
      {children}
    </span>
  );
}
