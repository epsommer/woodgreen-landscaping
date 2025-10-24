'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#F0F4F0] dark:bg-[#1C1C1C]">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-[#2F3B30] dark:text-white mb-4">
              Error
            </h1>
            <h2 className="text-2xl font-semibold text-[#4A5D4C] dark:text-gray-300 mb-4">
              Something went wrong
            </h2>
            <p className="text-[#4A5D4C] dark:text-gray-400 mb-8">
              We&apos;re sorry for the inconvenience. Please try again.
            </p>
            <Button
              onClick={reset}
              className="bg-[#2F3B30] text-white hover:bg-[#4A5D4C]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
