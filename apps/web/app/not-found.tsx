import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Container>
      <div className='flex flex-col gap-4 w-full max-w-[512px]'>
        <h1 className='text-4xl font-bold'>
          Looks like you&apos;ve found the doorway to the great nothing
        </h1>
        <p className='text-lg'>
          Sorry about that! Please visit our hompage to get where you need to
          go.
        </p>
        <Button asChild>
          <Link href='/'>Take me there</Link>
        </Button>
      </div>
    </Container>
  );
}
