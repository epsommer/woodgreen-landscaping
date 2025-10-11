// app/services/page.tsx
import { ServicesNew } from "@/components/pages-services-new";

export const metadata = {
  title: "Services - Zero-Emission Landscaping",
  description:
    "Professional landscaping services with 100% battery-powered equipment. Eco-conscious lawn care, custom garden design, tree services, and water-smart irrigation. Design meets sustainability.",
};

const ServicesPageWrapper = () => {
  return <ServicesNew />;
};

export default ServicesPageWrapper;
