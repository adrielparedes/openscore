"use client";

import { loginAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useActionState } from "react";
import { Trophy } from "lucide-react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: any, formData: FormData) => loginAction(formData),
    null
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-rose-600 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to Openscore</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your predictions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form action={formAction} className="flex flex-col gap-5">
            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {state.error}
              </div>
            )}

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <Button type="submit" loading={pending} size="lg" className="w-full mt-1">
              Sign in
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-slate-500 hover:text-rose-600 transition-colors">
              Forgot your password?
            </Link>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-rose-600 hover:text-rose-500 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
