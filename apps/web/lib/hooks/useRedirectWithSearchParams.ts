import { useSearchParams, useRouter } from 'next/navigation';

/**
 * The useRedirectWithSearchParams hook is used to redirect to a different page with search params.
 * @returns {object} The redirectWithSearchParams function and the searchParams object.
 * @example
 * const { redirectWithSearchParams } = useRedirectWithSearchParams();
 * redirectWithSearchParams({ page: 2 });
 *
 */
export function useRedirectWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return {
    /**
     * The redirectWithSearchParams function is used to redirect to a different page with search params.
     * @param {object} object - The object to be added to the search params.
     * @param {object} options - The options object.
     * @param {string} options.href - The href property is used to redirect to a different page.
     * @param {boolean} options.scroll - The scroll property is used to control the scroll behavior.
     * @example
     * redirectWithSearchParams({ page: 2 });
     * redirectWithSearchParams({ page: 2 }, { href: '/symbols' });
     * redirectWithSearchParams({ page: 2 }, { scroll: false });
     * redirectWithSearchParams({ page: 2 }, { href: '/symbols', scroll: false });
     */
    redirectWithSearchParams(
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
      Object.entries(object).forEach(([key, value]) => {
        params.set(key, String(value));
      });
      router.push(`${options?.href || ''}?${params.toString()}`, {
        scroll: options?.scroll,
      });
    },
    searchParams,
  };
}
