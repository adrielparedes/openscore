/** SHA-256 password hash using Web Crypto API (Edge + Node compatible).
 *  Produces the same hex digest as the legacy Java SHA-256 implementation. */
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hash = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
