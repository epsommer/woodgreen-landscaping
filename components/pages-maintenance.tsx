"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PagesMaintenance() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] bg-background text-foreground px-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4 text-center">Under Maintenance</h1>
      <p className="text-xl text-center max-w-md mb-8">
        We&apos;re currently updating our website to serve you better. Please
        check back soon!
      </p>
      <p className="text-sm text-center mb-6">
        For urgent inquiries, please contact us at{" "}
        <a
          href="mailto:support@woodgreenlandscaping.com"
          className="text-primary hover:underline"
        >
          support@woodgreenlandscaping.com
        </a>
      </p>
      <Link href="/">
        <Button variant="outline">Return to Home</Button>
      </Link>
    </div>
  );
}

