import Link from 'next/link';
import { Button } from '../components/ui/button';

export default function Custom404() {
  return (
    <div className='flex flex-col gap-4 w-full max-w-[512px]'>
      <h1 className='text-4xl font-bold'>
        Looks like you've found the doorway to the great nothing
      </h1>
      <p className='text-lg'>
        Sorry about that! Please visit our hompage to get where you need to go.
      </p>
      <Link href='/'>
        <Button>Take me there</Button>
      </Link>
    </div>
  );
}
