import { auth } from "@/lib/auth";
import { getMiUsuario } from "@/actions/usuarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import PersonalCardUpload from "@/components/profile/PersonalCardUpload";
import { redirect } from "next/navigation";
import { User, Mail, Globe, CreditCard } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const usuario = await getMiUsuario();

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and personal card</p>
      </div>

      {/* Account info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Full name</p>
                <p className="text-sm font-medium text-slate-900">
                  {usuario.nombre} {usuario.apellido}
                </p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-900">{usuario.email}</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Country</p>
                <p className="text-sm font-medium text-slate-900">{usuario.pais.nombre}</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Personal card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rose-500" />
            <CardTitle>Personal Card</CardTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Upload an image that represents you — it will appear on your profile and leaderboard.
          </p>
        </CardHeader>
        <CardContent>
          <PersonalCardUpload currentCard={usuario.personalCard ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
