import { MaintenanceNav } from "@/components/maintenance-nav";
import { MaintenanceFooter } from "@/components/maintenance-footer";

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MaintenanceNav />
      {children}
      <MaintenanceFooter />
    </div>
  );
}
