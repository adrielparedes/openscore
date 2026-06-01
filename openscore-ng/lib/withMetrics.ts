import { actionDuration, actionsInflight, actionErrors } from "./metrics";

/**
 * Returns true for Next.js-internal throws (redirect, notFound) that should
 * never be counted as application errors.
 */
function isNextInternalThrow(err: unknown): boolean {
  const digest = (err as { digest?: string } | null)?.digest;
  return (
    typeof digest === "string" &&
    (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"))
  );
}

/**
 * Wraps an async callback with server-action performance instrumentation.
 * Call this inside exported server action functions rather than wrapping the
 * export itself, so Next.js can still identify the function as a server action.
 *
 * @example
 * export async function loginAction(formData: FormData) {
 *   return recordAction("loginAction", async () => {
 *     // original body here
 *   });
 * }
 */
export async function recordAction<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  actionsInflight()?.add(1, { action: name });
  try {
    const result = await fn();
    actionDuration()?.record((performance.now() - start) / 1000, {
      action: name,
    });
    return result;
  } catch (err) {
    if (!isNextInternalThrow(err)) {
      actionErrors()?.add(1, {
        action: name,
        error_type: err instanceof Error ? err.constructor.name : "unknown",
      });
    }
    actionDuration()?.record((performance.now() - start) / 1000, {
      action: name,
    });
    throw err;
  } finally {
    actionsInflight()?.add(-1, { action: name });
  }
}
