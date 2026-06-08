"use client";

import { useTransition, useState, useRef } from "react";
import { updateSecurityQuestion } from "@/actions/usuarios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

interface PreguntaSecreta {
  id: number;
  pregunta: string;
}

interface Props {
  currentQuestion: string | null;
  preguntas: PreguntaSecreta[];
}

export default function UpdateSecurityQuestionForm({ currentQuestion, preguntas }: Props) {
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
      const result = await updateSecurityQuestion(formData);
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
      {currentQuestion ? (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">Current security question</p>
          <p className="text-sm text-muted-foreground rounded-lg border border-input bg-secondary/50 px-3 py-2">
            {currentQuestion}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground rounded-lg border border-input bg-secondary/50 px-3 py-2">
          No security question set.
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="preguntaSecretaId" className="text-sm font-medium text-foreground">
          New security question
        </label>
        <select
          id="preguntaSecretaId"
          name="preguntaSecretaId"
          required
          disabled={isPending}
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
        label="New answer"
        placeholder="Answer (not case-sensitive)"
        required
        disabled={isPending}
        autoComplete="off"
      />

      <Input
        id="currentPassword"
        name="currentPassword"
        type="password"
        label="Current password"
        placeholder="••••••••"
        required
        disabled={isPending}
        autoComplete="current-password"
      />

      {error && (
        <p className="text-sm text-primary bg-rose-100 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {success && (
        <p className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-lg px-3 py-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Security question updated successfully.
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isPending}>
          Update security question
        </Button>
      </div>
    </form>
  );
}
