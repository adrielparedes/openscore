"use client";

import { adminResetPassword, getUserStickerCard, toggleAdminRole, toggleBlockUsuario, deleteUsuario } from "@/actions/usuarios";
import { useState, useTransition } from "react";
import Image from "next/image";
import { User, Globe, Shield, ShieldOff, RotateCcw, ChevronDown, ChevronUp, CheckCircle, Wand2, Copy, Check, Eye, EyeOff, CreditCard, Loader2, Lock, Unlock, Trash2, AlertTriangle } from "lucide-react";

type Rol = { rol: string };
type Pais = { nombre: string };
type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  pais: Pais;
  roles: Rol[];
  blocked: boolean;
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

  const [isBlocked, setIsBlocked] = useState(usuario.blocked);
  const [blockPending, startBlockTransition] = useTransition();
  const [blockError, setBlockError] = useState<string | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

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

  function handleToggleBlock() {
    setBlockError(null);
    startBlockTransition(async () => {
      const result = await toggleBlockUsuario(usuario.id);
      if (result.error) {
        setBlockError(result.error);
      } else {
        setIsBlocked(result.blocked!);
      }
    });
  }

  function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteUsuario(usuario.id);
      if (result.error) {
        setDeleteError(result.error);
        setDeleteConfirm(false);
      } else {
        setDeleted(true);
      }
    });
  }

  if (deleted) return null;

  return (
    <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${isBlocked ? "border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/20" : "border-border bg-card"}`}>
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isBlocked ? "bg-amber-100 dark:bg-amber-900/30" : "bg-muted"}`}>
          <User className={`h-5 w-5 ${isBlocked ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm truncate">
              {usuario.nombre} {usuario.apellido}
            </p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 dark:bg-rose-900/20 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-400">
                <Shield className="h-3 w-3" />
                Admin
              </span>
            )}
            {isBlocked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                <Lock className="h-3 w-3" />
                Blocked
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="text-xs text-muted-foreground truncate">{usuario.email}</p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
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
                ? "border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:border-rose-300 dark:hover:border-rose-700"
                : "border-border text-muted-foreground hover:bg-muted hover:border-border"
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
            onClick={handleToggleBlock}
            disabled={blockPending}
            title={isBlocked ? "Unblock user" : "Block user"}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
              isBlocked
                ? "border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:border-amber-300 dark:hover:border-amber-700"
                : "border-border text-muted-foreground hover:bg-muted hover:border-border"
            }`}
          >
            {blockPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isBlocked ? (
              <Unlock className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            {isBlocked ? "Unblock" : "Block"}
          </button>
          <button
            onClick={handleToggleCard}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Card
            {cardOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleOpen}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deletePending}
            title={deleteConfirm ? "Click again to confirm deletion" : "Delete user"}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
              deleteConfirm
                ? "border-red-300 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-700"
                : "border-border text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 hover:text-red-600 dark:hover:text-red-400"
            }`}
          >
            {deletePending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : deleteConfirm ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {deleteConfirm ? "Confirm?" : "Delete"}
          </button>
        </div>
      </div>
      {adminError && (
        <div className="border-t border-rose-100 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/20 px-5 py-2 text-xs text-rose-600 dark:text-rose-400">
          {adminError}
        </div>
      )}
      {blockError && (
        <div className="border-t border-amber-100 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 px-5 py-2 text-xs text-amber-700 dark:text-amber-400">
          {blockError}
        </div>
      )}
      {deleteError && (
        <div className="border-t border-red-100 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-5 py-2 text-xs text-red-600 dark:text-red-400">
          {deleteError}
        </div>
      )}
      {deleteConfirm && !deletePending && (
        <div className="border-t border-red-100 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 px-5 py-2 flex items-center justify-between">
          <span className="text-xs text-red-700 dark:text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            This will permanently delete <strong>{usuario.nombre} {usuario.apellido}</strong>. Click Delete again to confirm.
          </span>
          <button
            onClick={() => setDeleteConfirm(false)}
            className="text-xs text-muted-foreground hover:text-foreground ml-4"
          >
            Cancel
          </button>
        </div>
      )}

      {cardOpen && (
        <div className="border-t border-border bg-muted px-5 py-4 flex items-center justify-center min-h-[80px]">
          {cardLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : stickerCard ? (
            <div className="relative w-32 aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-sm">
              <Image
                src={stickerCard}
                alt={`${usuario.nombre}'s sticker card`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">No sticker card uploaded</p>
          )}
        </div>
      )}

      {open && (
        <div className="border-t border-border bg-muted px-5 py-4">
          {success ? (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Password reset successfully
            </div>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground">
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
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    title="Copy password"
                    className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:border-border transition-colors"
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
