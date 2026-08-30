import { AppShell } from "@/components/app-shell";
import { MobileNav } from "@/components/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <MobileNav />
    </>
  );
}
