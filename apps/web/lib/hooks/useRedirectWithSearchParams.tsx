'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export function useRedirectWithSearchParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return {
    redirectWithSearchParams(object: Record<string, string>) {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(object).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`?${params.toString()}`);
    },
    searchParams,
  };
}
