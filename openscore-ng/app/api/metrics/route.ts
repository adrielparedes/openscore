import { collectMetrics } from '@/lib/otel'

// Force Node.js runtime — the OTel SDK does not run in the Edge runtime
export const runtime = 'nodejs'

export async function GET() {
  const body = await collectMetrics()
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; version=0.0.4; charset=utf-8' },
  })
}
