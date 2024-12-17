import { MainNav } from "@/components/main-nav";
import { Footer } from "@/components/footer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      {children}
      <Footer />
    </div>
  );
}
