function meter() {
  return globalThis.__otelMeterProvider?.getMeter("openscore");
}

// Server Actions
export const actionDuration = () =>
  meter()?.createHistogram("openscore_action_duration_seconds", {
    description: "Server action wall-clock duration",
    unit: "s",
    advice: { explicitBucketBoundaries: [0.05, 0.1, 0.25, 0.5, 1, 2.5] },
  });

export const actionsInflight = () =>
  meter()?.createUpDownCounter("openscore_actions_inflight", {
    description: "Currently executing server action invocations",
  });

export const actionErrors = () =>
  meter()?.createCounter("openscore_action_errors_total", {
    description: "Unhandled errors thrown by server actions",
  });

// Database
export const dbQueryDuration = () =>
  meter()?.createHistogram("openscore_db_query_duration_seconds", {
    description: "Prisma query wall-clock duration",
    unit: "s",
    advice: {
      explicitBucketBoundaries: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
    },
  });

export const dbErrors = () =>
  meter()?.createCounter("openscore_db_errors_total", {
    description: "Database errors by model, operation, and Prisma error code",
  });

// Ranking
export const rankingDuration = () =>
  meter()?.createHistogram("openscore_ranking_computation_duration_seconds", {
    description: "fetchRanking in-memory computation duration",
    unit: "s",
    advice: { explicitBucketBoundaries: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5] },
  });

export const rankingUsersScored = () =>
  meter()?.createHistogram("openscore_ranking_users_scored", {
    description: "Number of users processed per ranking computation",
    advice: { explicitBucketBoundaries: [10, 25, 50, 100, 200, 500] },
  });

// Standings
export const standingsDuration = () =>
  meter()?.createHistogram("openscore_standings_rebuild_duration_seconds", {
    description: "calculateStandings full delete-and-rebuild duration",
    unit: "s",
    advice: { explicitBucketBoundaries: [0.05, 0.1, 0.25, 0.5, 1, 2.5] },
  });

// Upload
export const uploadBytes = () =>
  meter()?.createHistogram("openscore_upload_bytes", {
    description: "Panini card upload file size",
    unit: "By",
    advice: {
      explicitBucketBoundaries: [
        51_200, 204_800, 512_000, 1_048_576, 2_097_152, 5_242_880,
      ],
    },
  });

export const uploadDuration = () =>
  meter()?.createHistogram("openscore_upload_duration_seconds", {
    description: "Panini card upload handler wall-clock duration",
    unit: "s",
    advice: { explicitBucketBoundaries: [0.05, 0.1, 0.25, 0.5, 1, 2.5] },
  });
