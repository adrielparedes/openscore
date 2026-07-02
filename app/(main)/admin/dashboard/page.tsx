import { auth } from "@/lib/auth";
import { getAnalytics } from "@/actions/analytics";
import { cachedGetForecastDefaults } from "@/lib/settings";
import { redirect } from "next/navigation";
import AdminDashboardContent from "./AdminDashboardContent";
import ForecastDefaultsCard from "@/components/admin/ForecastDefaultsCard";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const [analytics, forecastDefaults] = await Promise.all([
    getAnalytics(),
    cachedGetForecastDefaults(),
  ]);

  return (
    <>
      <AdminDashboardContent initialData={analytics} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <ForecastDefaultsCard
          initialDesktop={forecastDefaults.desktop}
          initialMobile={forecastDefaults.mobile}
        />
      </div>
    </>
  );
}
