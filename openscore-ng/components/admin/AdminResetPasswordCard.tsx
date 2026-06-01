"use client";

import { adminResetPassword, getUserStickerCard, toggleAdminRole } from "@/actions/usuarios";
import { useState, useTransition } from "react";
import Image from "next/image";
import { User, Globe, Shield, ShieldOff, RotateCcw, ChevronDown, ChevronUp, CheckCircle, Wand2, Copy, Check, Eye, EyeOff, CreditCard, Loader2 } from "lucide-react";

type Rol = { rol: string };
type Pais = { nombre: string };
type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  pais: Pais;
  roles: Rol[];
  createdAt: Date;
};

const ADJECTIVES = ["swift", "brave", "calm", "keen", "bold", "wise", "cool", "warm", "bright", "sharp"];
const NOUNS = ["tiger", "falcon", "river", "storm", "comet", "pixel", "spark", "blaze", "wave", "stone"];

function generatePassword(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  const sym = ["!", "@", "#", "$"][Math.floor(Math.random() * 4)];
  return `${adj}-${noun}${num}${sym}`;
}

export default function AdminResetPasswordCard({ usuario }: { usuario: Usuario }) {
  const [open, setOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [cardOpen, setCardOpen] = useState(false);
  const [stickerCard, setStickerCard] = useState<string | null | undefined>(undefined);
  const [cardLoading, setCardLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(usuario.roles.some((r) => r.rol === "ADMIN"));
  const [adminPending, startAdminTransition] = useTransition();
  const [adminError, setAdminError] = useState<string | null>(null);

  function handleOpen() {
    const isOpening = !open;
    setOpen(isOpening);
    setError(null);
    setSuccess(false);
    if (isOpening) {
      setNewPassword(generatePassword());
      setShowPassword(true);
    }
  }

  function handleSuggest() {
    setNewPassword(generatePassword());
    setShowPassword(true);
    setCopied(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(newPassword).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData();
    formData.set("usuarioId", String(usuario.id));
    formData.set("newPassword", newPassword);
    startTransition(async () => {
      const result = await adminResetPassword(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setNewPassword("");
        setTimeout(() => { setSuccess(false); setOpen(false); }, 2500);
      }
    });
  }

  async function handleToggleCard() {
    if (cardOpen) {
      setCardOpen(false);
      return;
    }
    setCardOpen(true);
    if (stickerCard !== undefined) return;
    setCardLoading(true);
    const result = await getUserStickerCard(usuario.id);
    setStickerCard("stickerCard" in result ? result.stickerCard : null);
    setCardLoading(false);
  }

  function handleToggleAdmin() {
    setAdminError(null);
    startAdminTransition(async () => {
      const result = await toggleAdminRole(usuario.id);
      if (result.error) {
        setAdminError(result.error);
      } else {
        setIsAdmin(result.isAdmin!);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4">
        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          <User className="h-5 w-5 text-slate-500" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 text-sm truncate">
              {usuario.nombre} {usuario.apellido}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-slate-400 truncate">{usuario.email}</p>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Globe className="h-3 w-3" />
              {usuario.pais.nombre}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleAdmin}
            disabled={adminPending}
            title={isAdmin ? "Revoke admin" : "Grant admin"}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
              isAdmin
                ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {adminPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isAdmin ? (
              <ShieldOff className="h-3.5 w-3.5" />
            ) : (
              <Shield className="h-3.5 w-3.5" />
            )}
            {isAdmin ? "Revoke admin" : "Make admin"}
          </button>
          <button
            onClick={handleToggleCard}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Card
            {cardOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleOpen}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      {adminError && (
        <div className="border-t border-rose-100 bg-rose-50 px-5 py-2 text-xs text-rose-600">
          {adminError}
        </div>
      )}

      {cardOpen && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 flex items-center justify-center min-h-[80px]">
          {cardLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          ) : stickerCard ? (
            <div className="relative w-32 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <Image
                src={stickerCard}
                alt={`${usuario.nombre}'s sticker card`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No sticker card uploaded</p>
          )}
        </div>
      )}

      {open && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
          {success ? (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Password reset successfully
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-600">
                    New password for {usuario.nombre}
                  </label>
                  <button
                    type="button"
                    onClick={handleSuggest}
                    className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
                  >
                    <Wand2 className="h-3 w-3" />
                    Suggest password
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Copy password"
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60 transition-colors"
                  >
                    {isPending ? "Saving…" : "Save"}
                  </button>
                </div>

                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
