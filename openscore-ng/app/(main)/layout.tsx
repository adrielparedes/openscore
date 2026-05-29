import Navbar from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-400">
        Openscore © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
