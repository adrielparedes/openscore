"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAction } from "@/lib/withMetrics";
import { unstable_cache, revalidateTag } from "next/cache";

export type ForecastDefault = "upcoming" | "all" | "bracket";

export const SETTING_KEYS = {
  FORECAST_DEFAULT_DESKTOP: "forecast_default_desktop",
  FORECAST_DEFAULT_MOBILE: "forecast_default_mobile",
} as const;

const DEFAULTS: Record<string, string> = {
  [SETTING_KEYS.FORECAST_DEFAULT_DESKTOP]: "upcoming",
  [SETTING_KEYS.FORECAST_DEFAULT_MOBILE]: "upcoming",
};

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Forbidden");
}

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? DEFAULTS[key] ?? "";
}

export const cachedGetForecastDefaults = unstable_cache(
  async () => {
    const rows = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            SETTING_KEYS.FORECAST_DEFAULT_DESKTOP,
            SETTING_KEYS.FORECAST_DEFAULT_MOBILE,
          ],
        },
      },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      desktop: (map[SETTING_KEYS.FORECAST_DEFAULT_DESKTOP] ??
        DEFAULTS[SETTING_KEYS.FORECAST_DEFAULT_DESKTOP]) as ForecastDefault,
      mobile: (map[SETTING_KEYS.FORECAST_DEFAULT_MOBILE] ??
        DEFAULTS[SETTING_KEYS.FORECAST_DEFAULT_MOBILE]) as ForecastDefault,
    };
  },
  ["forecast-defaults"],
  { tags: ["settings"], revalidate: false }
);

export async function updateSetting(key: string, value: string): Promise<void> {
  await requireAdmin();
  await recordAction("updateSetting", async () => {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  });
  revalidateTag("settings");
}

export async function getForecastDefaultsAdmin() {
  await requireAdmin();
  return cachedGetForecastDefaults();
}

export async function updateForecastDefaults(
  desktop: ForecastDefault,
  mobile: ForecastDefault
) {
  await requireAdmin();
  await recordAction("updateForecastDefaults", async () => {
    await prisma.$transaction([
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.FORECAST_DEFAULT_DESKTOP },
        update: { value: desktop },
        create: { key: SETTING_KEYS.FORECAST_DEFAULT_DESKTOP, value: desktop },
      }),
      prisma.setting.upsert({
        where: { key: SETTING_KEYS.FORECAST_DEFAULT_MOBILE },
        update: { value: mobile },
        create: { key: SETTING_KEYS.FORECAST_DEFAULT_MOBILE, value: mobile },
      }),
    ]);
  });
  revalidateTag("settings");
}
