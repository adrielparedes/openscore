import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export type ForecastDefault = "upcoming" | "all" | "bracket";

export const SETTING_KEYS = {
  FORECAST_DEFAULT_DESKTOP: "forecast_default_desktop",
  FORECAST_DEFAULT_MOBILE: "forecast_default_mobile",
} as const;

const DEFAULTS: Record<string, string> = {
  [SETTING_KEYS.FORECAST_DEFAULT_DESKTOP]: "upcoming",
  [SETTING_KEYS.FORECAST_DEFAULT_MOBILE]: "upcoming",
};

export function getDefault(key: string): string {
  return DEFAULTS[key] ?? "";
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
  { revalidate: 60 }
);
