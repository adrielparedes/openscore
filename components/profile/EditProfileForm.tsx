"use client";

import { useTransition, useState } from "react";
import { updateUsuario } from "@/actions/usuarios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

interface Pais {
  id: number;
  nombre: string;
  codigo: string;
}

interface Props {
  nombre: string;
  apellido: string;
  paisCodigo: string;
  paises: Pais[];
}

export default function EditProfileForm({ nombre, apellido, paisCodigo, paises }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateUsuario(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="nombre"
          name="nombre"
          label="First name"
          defaultValue={nombre}
          minLength={2}
          required
          disabled={isPending}
        />
        <Input
          id="apellido"
          name="apellido"
          label="Last name"
          defaultValue={apellido}
          minLength={2}
          required
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="pais" className="text-sm font-medium text-foreground">
          Country
        </label>
        <select
          id="pais"
          name="pais"
          defaultValue={paisCodigo}
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {paises.map((p) => (
            <option key={p.id} value={p.codigo}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-sm text-primary bg-rose-900/20 border border-rose-800/50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-900/20 border border-emerald-700/50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Profile updated successfully.
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
