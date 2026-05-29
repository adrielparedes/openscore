"use client";

import { getForgotPasswordQuestion, resetPasswordAction } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Trophy, CheckCircle } from "lucide-react";

type Step = "email" | "answer" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pregunta, setPregunta] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await getForgotPasswordQuestion(formData);
      if ("error" in result) {
        setError(result.error ?? "Unknown error");
      } else {
        setEmail(result.email);
        setPregunta(result.pregunta);
        setStep("answer");
      }
    });
  }

  function handleResetSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("email", email);
    startTransition(async () => {
      const result = await resetPasswordAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setStep("done");
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-rose-600 flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Recover your account</h1>
          <p className="text-slate-500 text-sm mt-1">Answer your security question to reset your password</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <Button type="submit" loading={isPending} size="lg" className="w-full">
                Continue
              </Button>
            </form>
          )}

          {step === "answer" && (
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-5">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
                <p className="text-xs text-slate-400 mb-1">Security question for <span className="font-medium text-slate-600">{email}</span></p>
                <p className="text-sm font-medium text-slate-800">{pregunta}</p>
              </div>

              <Input
                id="respuesta"
                name="respuesta"
                label="Your answer"
                placeholder="Answer (not case-sensitive)"
                required
                autoComplete="off"
              />

              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                label="New password"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />

              <Button type="submit" loading={isPending} size="lg" className="w-full">
                Reset password
              </Button>

              <button
                type="button"
                onClick={() => { setStep("email"); setError(null); }}
                className="text-sm text-slate-500 hover:text-slate-700 text-center"
              >
                ← Use a different email
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-900">Password reset!</p>
                <p className="text-sm text-slate-500 mt-1">You can now sign in with your new password.</p>
              </div>
              <Link
                href="/login"
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Go to login
              </Link>
            </div>
          )}

          {step !== "done" && (
            <p className="mt-6 text-center text-sm text-slate-500">
              Remembered your password?{" "}
              <Link href="/login" className="text-rose-600 hover:text-rose-500 font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
