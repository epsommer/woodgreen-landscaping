// app/page.tsx
"use client";

import { useRouter } from "next/navigation";

export default function HomePageWrapper() {
  const isMaintenanceMode = false;
  const router = useRouter();

  if (isMaintenanceMode) {
    router.replace("/under-maintenance");
    return null;
  }

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
}
