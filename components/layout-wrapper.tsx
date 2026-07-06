import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { TopBar } from "./top-bar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 md:ml-64 pt-20 md:pt-6 px-4 md:px-8 pb-12 w-full max-w-[1600px] mx-auto">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
