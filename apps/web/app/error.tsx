'use client';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className='flex flex-col gap-4 w-full max-w-[512px]'>
        <h1 className='text-4xl font-bold'>Something went wrong!</h1>
        <p className='text-lg'>
          We&apos;re sorry, something went wrong. Please try again.
        </p>
        <pre className='text-sm text-wrap text-gray-500 overflow-auto bg-gray-100 p-4'>
          {error.message}
        </pre>
        <div>
          <Button onClick={() => reset()}>Let&apos;s try again</Button>
        </div>
      </div>
    </Container>
  );
}
