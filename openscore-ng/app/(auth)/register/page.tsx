"use client";

import { registerAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import { getPaises } from "@/actions/usuarios";
import type { Pais } from "@/types";

export default function RegisterPage() {
  const [paises, setPaises] = useState<Pais[]>([]);
  const [state, formAction, pending] = useActionState(
    async (_prev: any, formData: FormData) => registerAction(formData),
    null
  );

  useEffect(() => {
    getPaises().then(setPaises);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-rose-600 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Join Openscore and start predicting</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input id="nombre" name="nombre" label="First name" placeholder="John" required />
              <Input id="apellido" name="apellido" label="Last name" placeholder="Doe" required />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min 6 characters"
              required
              minLength={6}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="pais" className="text-sm font-medium text-slate-700">
                Country
              </label>
              <select
                id="pais"
                name="pais"
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Select a country…</option>
                {paises.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" loading={pending} size="lg" className="w-full mt-2">
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-600 hover:text-rose-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
