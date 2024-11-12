// app/terms/page.tsx
import { Terms } from "@/components/pages-terms";

export const metadata = {
  title: "Terms of Service",
  description:
    "Review the terms of service for using Woodgreen Landscaping's website and services.",
};

const TermsOfServicePageWrapper = () => {
  return <Terms />;
};

export default TermsOfServicePageWrapper;
