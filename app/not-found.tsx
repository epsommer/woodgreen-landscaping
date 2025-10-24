import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F0F4F0] dark:bg-[#1C1C1C]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#2F3B30] dark:text-white mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-[#4A5D4C] dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-[#4A5D4C] dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-[#2F3B30] text-white hover:bg-[#4A5D4C]">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
