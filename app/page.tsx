// app/page.tsx
import { UnderMaintenance } from "@/components/under-maintenance"; // Your maintenance component
import { Home } from "@/components/pages-home";

export default function HomePageWrapper() {
  const isMaintenanceMode = true;

  if (isMaintenanceMode) {
    return <UnderMaintenance />;
  } else {
    return <Home />;
  }
}
