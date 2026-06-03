"use client";

import { registerAction, getPreguntasSecretas } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { Trophy } from "lucide-react";

type PreguntaSecreta = { id: number; pregunta: string };

const PAISES = [
  { codigo: "ARG", nombre: "Argentina" },
  { codigo: "BRA", nombre: "Brazil" },
  { codigo: "CHL", nombre: "Chile" },
  { codigo: "COL", nombre: "Colombia" },
  { codigo: "MEX", nombre: "Mexico" },
  { codigo: "PER", nombre: "Peru" },
];

export default function RegisterPage() {
  const [preguntas, setPreguntas] = useState<PreguntaSecreta[]>([]);
  const [fields, setFields] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    pais: "",
    preguntaSecretaId: "",
    respuestaSecreta: "",
  });
  const [state, formAction, pending] = useActionState(
    async (_prev: any, formData: FormData) => registerAction(formData),
    null
  );

  useEffect(() => {
    getPreguntasSecretas().then(setPreguntas);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
              <Input id="nombre" name="nombre" label="First name" placeholder="John" required value={fields.nombre} onChange={handleChange} />
              <Input id="apellido" name="apellido" label="Last name" placeholder="Doe" required value={fields.apellido} onChange={handleChange} />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@redhat.com"
              required
              value={fields.email}
              onChange={handleChange}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min 6 characters"
              required
              minLength={6}
              value={fields.password}
              onChange={handleChange}
            />

            <div className="flex flex-col gap-1">
              <label htmlFor="pais" className="text-sm font-medium text-slate-700">
                Country
              </label>
              <select
                id="pais"
                name="pais"
                required
                value={fields.pais}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="">Select a country…</option>
                {PAISES.map((p) => (
                  <option key={p.codigo} value={p.codigo}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-1 flex flex-col gap-4">
              <p className="text-xs text-slate-500">
                Choose a security question for account recovery.
              </p>

              <div className="flex flex-col gap-1">
                <label htmlFor="preguntaSecretaId" className="text-sm font-medium text-slate-700">
                  Security question
                </label>
                <select
                  id="preguntaSecretaId"
                  name="preguntaSecretaId"
                  required
                  value={fields.preguntaSecretaId}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">Select a question…</option>
                  {preguntas.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.pregunta}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="respuestaSecreta"
                name="respuestaSecreta"
                label="Your answer"
                placeholder="Answer (not case-sensitive)"
                required
                autoComplete="off"
                value={fields.respuestaSecreta}
                onChange={handleChange}
              />
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
