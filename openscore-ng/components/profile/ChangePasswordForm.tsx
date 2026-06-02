"use client";

import { useTransition, useState, useRef } from "react";
import { updatePassword } from "@/actions/usuarios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export default function ChangePasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        formRef.current?.reset();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="oldPassword"
        name="oldPassword"
        type="password"
        label="Current password"
        placeholder="••••••••"
        required
        disabled={isPending}
        autoComplete="current-password"
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="New password"
        placeholder="••••••••"
        minLength={6}
        required
        disabled={isPending}
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Password changed successfully.
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          Change password
        </Button>
      </div>
    </form>
  );
}
