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
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account details and sticker card</p>
      </div>

      <div className="hidden md:flex gap-6">
        {/* Left column: Account Information + Edit Profile */}
        <div className="flex-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{usuario.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Edit Profile</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Update your name and country.</p>
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
        </div>

        {/* Right column: Sticker Card + Change Password */}
        <div className="flex-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Sticker Card</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your sticker card — it will appear on your profile and leaderboard.
              </p>
            </CardHeader>
            <CardContent>
              <StickerCardUpload currentCard={usuario.stickerCard ?? null} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Enter your current password to set a new one.</p>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="flex flex-col gap-6 md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">{usuario.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle>Sticker Card</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your sticker card — it will appear on your profile and leaderboard.
            </p>
          </CardHeader>
          <CardContent>
            <StickerCardUpload currentCard={usuario.stickerCard ?? null} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Edit Profile</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Update your name and country.</p>
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

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Enter your current password to set a new one.</p>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
