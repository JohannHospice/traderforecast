import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * The useRedirectWithSearchParams hook is used to redirect to a different page with search params.
 * @returns The redirectParams function and the searchParams object.
 * @example
 * const { redirectParams } = useRedirectWithSearchParams();
 * redirectParams({ page: 2 });
 *
 */
export function useRedirectParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return {
    /**
     * The redirectParams function is used to redirect to a different page with search params.
     * @param {object} object - The object to be added to the search params.
     * @param {object} options - The options object.
     * @param {string} options.href - The href property is used to redirect to a different page.
     * @param {boolean} options.scroll - The scroll property is used to control the scroll behavior.
     * @example
     * redirectParams({ page: 2 });
     * redirectParams({ page: 2 }, { href: '/symbols' });
     * redirectParams({ page: 2 }, { scroll: false });
     * redirectParams({ page: 2 }, { href: '/symbols', scroll: false });
     */
    redirectParams(
      object: Record<string, string | number>,
      options?: {
        /*
         * The href property is used to redirect to a different page.
         */
        href?: string;
        /*
         * The scroll property is used to control the scroll behavior.
         */
        scroll?: boolean;
      }
    ) {
      const params = new URLSearchParams(searchParams.toString());

      // assign new params
      Object.entries(object).forEach(([key, value]) => {
        params.set(key, String(value));
      });

      // clean empty params
      params.forEach((value, key) => {
        if (value === '') {
          params.delete(key);
        }
      });

      // redirect
      router.push(`${options?.href || pathname}?${params.toString()}`, {
        scroll: options?.scroll,
      });
    },
    searchParams,
  };
}
