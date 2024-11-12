// app/about/page.tsx
import { About } from "@/components/pages-about";

export const metadata = {
  title: "About",
  description:
    "Learn more about Woodgreen Landscaping and our commitment to excellence.",
};

const AboutPageWrapper = () => {
  return <About />;
};

export default AboutPageWrapper;
