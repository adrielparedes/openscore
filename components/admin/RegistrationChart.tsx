"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { DailyRegistration } from "@/actions/analytics";

const COUNTRY_COLORS = [
  "#e11d48",
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#4f46e5",
  "#0d9488",
  "#c026d3",
];

interface RegistrationChartProps {
  days: DailyRegistration[];
  countries: Array<{ code: string; name: string }>;
}

export default function RegistrationChart({
  days,
  countries,
}: RegistrationChartProps) {
  const chartData = days.map((d) => ({
    date: formatDate(d.date),
    ...d.byCountry,
  }));

  const colorMap = new Map<string, string>();
  countries.forEach((c, i) => {
    colorMap.set(c.code, COUNTRY_COLORS[i % COUNTRY_COLORS.length]);
  });

  if (chartData.length === 0) {
    return (
      <p className="text-muted-foreground text-sm text-center py-6">
        No registration data available.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ fontWeight: 600, marginBottom: 4 }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
        />
        {countries.map((c) => (
          <Bar
            key={c.code}
            dataKey={c.code}
            name={c.name}
            stackId="registrations"
            fill={colorMap.get(c.code)}
            radius={[0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}
