// export default function Custom404() {
//   return (
//     <div>
//       <h1>
//         <span>404</span>
//         <span>Looks like you're lost.</span>
//       </h1>
//       <p>
//         <span>The page you are looking for is not available.</span>
//         <span>Please check the URL or go to the main page.</span>
//       </p>
//     </div>
//   );
// }
'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
