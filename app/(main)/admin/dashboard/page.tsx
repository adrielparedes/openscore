import { auth } from "@/lib/auth";
import { getAnalytics } from "@/actions/analytics";
import { redirect } from "next/navigation";
import AdminDashboardContent from "./AdminDashboardContent";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) redirect("/");

  const analytics = await getAnalytics();

  return <AdminDashboardContent initialData={analytics} />;
}
