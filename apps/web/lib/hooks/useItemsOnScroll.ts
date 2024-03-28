import { useEffect, useRef, useState } from 'react';

export function useItemsOnScroll<T>({
  items,
  offset,
  onLoadMore,
  key = [],
}: {
  items: T[];
  offset: number;
  onLoadMore: () => void;
  key: (string | undefined)[];
}) {
  const [virtualItems, setVirtualItems] = useState<T[]>([]);
  const currentKey = useRef<(string | undefined)[]>([Math.random().toString()]);

  useEffect(() => {
    if (!sameKey(currentKey.current, key)) {
      setVirtualItems(items);
      currentKey.current = key;
    }

    function loadOnScroll() {
      if (
        window.innerHeight + window.scrollY + offset <=
          document.body.offsetHeight ||
        virtualItems.length === 0 ||
        items.length === 0
      ) {
        return;
      }

      setVirtualItems((prev) =>
        Array.from(new Set([...prev, ...items]).values())
      );
    }

    window.addEventListener('scroll', loadOnScroll);

    return () => window.removeEventListener('scroll', loadOnScroll);
  }, [items, offset, virtualItems, key]);

  // request to load more
  useEffect(() => {
    if (items.length === 0 && sameKey(currentKey.current, key)) return;

    if (items.every((item) => virtualItems.includes(item))) {
      onLoadMore();
    }
  }, [virtualItems, items, onLoadMore, key]);

  return virtualItems;
}

function sameKey(
  prevKey: (string | undefined)[],
  nextKey: (string | undefined)[]
) {
  return prevKey.join('@') === nextKey.join('@');
}
