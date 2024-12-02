"use client";
import { useRouter } from "next/navigation";
import { Home } from "@/components/pages-home";

export default function HomePage() {
  const router = useRouter();

  if (process.env.MAINTENANCE_MODE === "true") {
    router.push("/maintenance");
    return null;
  }

  return <Home />;
}
