export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initOtel } = require('./lib/otel') as typeof import('./lib/otel')
    initOtel()
  }
}
