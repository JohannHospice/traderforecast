import { BadgeIndice } from '@/components/badge-indice';

export function IndicatorCommandLabel({
  badge,
  children,
}: {
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {badge && <BadgeIndice>{badge}</BadgeIndice>} {children}
    </>
  );
}
