import { MeterProvider } from '@opentelemetry/sdk-metrics'
import {
  PrometheusExporter,
  PrometheusSerializer,
} from '@opentelemetry/exporter-prometheus'

declare global {
  // eslint-disable-next-line no-var
  var __otelExporter: PrometheusExporter | undefined
  // eslint-disable-next-line no-var
  var __otelMeterProvider: MeterProvider | undefined
  // eslint-disable-next-line no-var
  var __pgPool:
    | { totalCount: number; idleCount: number; waitingCount: number }
    | undefined
}

export function initOtel() {
  if (globalThis.__otelExporter) return

  const exporter = new PrometheusExporter({ preventServerStart: true })
  const meterProvider = new MeterProvider({ readers: [exporter] })

  globalThis.__otelExporter = exporter
  globalThis.__otelMeterProvider = meterProvider

  // Observable gauge that lazily reads the pg Pool once lib/prisma.ts has loaded.
  // The callback runs on every scrape, so the pool will be present by then.
  meterProvider
    .getMeter('openscore')
    .createObservableGauge('openscore_db_pool_connections', {
      description: 'pg connection pool size by state',
    })
    .addCallback((obs) => {
      const p = globalThis.__pgPool
      if (!p) return
      obs.observe(p.totalCount, { state: 'total' })
      obs.observe(p.idleCount, { state: 'idle' })
      obs.observe(p.waitingCount, { state: 'waiting' })
    })
}

export async function collectMetrics(): Promise<string> {
  const exporter = globalThis.__otelExporter
  if (!exporter) return '# OTel not initialised\n'

  const { resourceMetrics, errors } = await exporter.collect()
  if (errors.length) {
    console.error('[otel] metrics collection errors', errors)
  }

  return new PrometheusSerializer().serialize(resourceMetrics)
}
