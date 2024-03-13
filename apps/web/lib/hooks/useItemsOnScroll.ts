import { useEffect, useState } from 'react';

export function useItemsOnScroll<T>(items: T[], size: number, offset: number) {
  const [virtualItems, setVirtualItems] = useState<T[]>([]);

  useEffect(() => {
    setVirtualItems(items.slice(0, size));

    function loadOnScroll() {
      if (
        window.innerHeight + window.scrollY + offset <=
        document.body.offsetHeight
      ) {
        return;
      }
      setVirtualItems((prev) => [
        ...prev,
        ...items.slice(prev.length, prev.length + size),
      ]);
    }

    window.addEventListener('scroll', loadOnScroll);
    return () => window.removeEventListener('scroll', loadOnScroll);
  }, [items, size, offset]);

  return virtualItems;
}
