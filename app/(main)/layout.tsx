import { LayoutProvider } from "@/components/providers/LayoutProvider";
import AppShell from "@/components/layout/AppShell";
import { CountdownProvider } from "@/components/providers/CountdownProvider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <AppShell>
        <CountdownProvider>{children}</CountdownProvider>
      </AppShell>
    </LayoutProvider>
  );
}
