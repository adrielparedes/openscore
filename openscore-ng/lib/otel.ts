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
}

export function initOtel() {
  if (globalThis.__otelExporter) return

  const exporter = new PrometheusExporter({ preventServerStart: true })
  const meterProvider = new MeterProvider({ readers: [exporter] })

  globalThis.__otelExporter = exporter
  globalThis.__otelMeterProvider = meterProvider
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
