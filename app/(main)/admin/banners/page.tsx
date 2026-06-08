import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBanners } from "@/actions/banners";
import BannerManager from "@/components/admin/BannerManager";
import { ImageIcon } from "lucide-react";

export default async function AdminBannersPage() {
  const session = await auth();
  const roles = ((session?.user as any)?.roles ?? []) as string[];
  if (!roles.includes("ADMIN")) redirect("/");

  const banners = await getBanners();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Carousel Banners</h1>
          <p className="text-sm text-muted-foreground">Manage images displayed on the home page carousel. Drag to reorder.</p>
        </div>
      </div>
      <BannerManager banners={banners} />
    </div>
  );
}
