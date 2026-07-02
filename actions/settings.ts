"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { recordAction } from "@/lib/withMetrics";
import { revalidatePath } from "next/cache";
import { SETTING_KEYS, getDefault, cachedGetForecastDefaults } from "@/lib/settings";
import type { ForecastDefault } from "@/lib/settings";

async function requireAdmin(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const roles = (session.user as any)?.roles ?? [];
  if (!roles.includes("ADMIN")) throw new Error("Forbidden");
}

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? getDefault(key);
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await requireAdmin();
  await recordAction("updateSetting", async () => {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  });
  revalidatePath("/forecast");
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
  revalidatePath("/forecast");
  revalidatePath("/admin/dashboard");
}
