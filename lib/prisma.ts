import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { dbQueryDuration, dbErrors } from "./metrics";

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton;
  __pgPool: Pool;
};

function createPrismaClient() {
  const adapter = new PrismaPg(globalForPrisma.__pgPool);
  const client = new PrismaClient({ adapter });

  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const start = performance.now();
          try {
            const result = await query(args);
            dbQueryDuration()?.record((performance.now() - start) / 1000, {
              model: model ?? "unknown",
              operation,
            });
            return result;
          } catch (err: unknown) {
            dbErrors()?.add(1, {
              model: model ?? "unknown",
              operation,
              error_code:
                (err as { code?: string } | null)?.code ?? "unknown",
            });
            throw err;
          }
        },
      },
    },
  });
}

// Initialise the pool singleton before createPrismaClient reads it
if (!globalForPrisma.__pgPool) {
  globalForPrisma.__pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export const pool = globalForPrisma.__pgPool;
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
