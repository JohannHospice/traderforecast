'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function GroupButton({
  tabs,
  defaultValue,
}: {
  defaultValue?: string | null;
  tabs: { value: string; label: React.ReactNode; onClick: () => void }[];
}) {
  return (
    <Tabs defaultValue={defaultValue || undefined}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} onClick={tab.onClick}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
