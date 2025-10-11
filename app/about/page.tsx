// app/about/page.tsx
import { AboutNew } from "@/components/pages-about-new";

export const metadata = {
  title: "About - Where Design Meets the Earth",
  description:
    "From London to Toronto, discover the story behind Woodgreen Landscaping. One designer, 20+ years of legacy training, 100% battery-powered equipment, and a passion for eco-conscious landscape artistry.",
};

const AboutPageWrapper = () => {
  return <AboutNew />;
};

export default AboutPageWrapper;
