import { auth } from "@/lib/auth";
import { getMiUsuario, getPaises } from "@/actions/usuarios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import StickerCardUpload from "@/components/profile/StickerCardUpload";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import { redirect } from "next/navigation";
import { Mail, CreditCard, Pencil, KeyRound } from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [usuario, paises] = await Promise.all([getMiUsuario(), getPaises()]);
  if (!usuario) redirect("/api/auth/signout");

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account details and sticker card</p>
      </div>

      {/* Email (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm font-medium text-slate-900">{usuario.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Pencil className="h-4 w-4 text-slate-500" />
            <CardTitle>Edit Profile</CardTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">Update your name and country.</p>
        </CardHeader>
        <CardContent>
          <EditProfileForm
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            paisCodigo={usuario.pais.codigo}
            paises={paises}
          />
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-slate-500" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">Enter your current password to set a new one.</p>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Sticker card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-rose-500" />
            <CardTitle>Sticker Card</CardTitle>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Upload your sticker card — it will appear on your profile and leaderboard.
          </p>
        </CardHeader>
        <CardContent>
          <StickerCardUpload currentCard={usuario.stickerCard ?? null} />
        </CardContent>
      </Card>
    </div>
  );
}
