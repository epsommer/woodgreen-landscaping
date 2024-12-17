import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function Template({ children }: { children: React.ReactNode }) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    return <>{children}</>;
  }

  return (
    <>
      <MainNav />
      {children}
      <Footer />
    </>
  );
}
