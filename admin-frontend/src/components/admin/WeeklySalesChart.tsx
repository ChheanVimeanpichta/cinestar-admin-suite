import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface WeeklySalesChartProps {
  data: { day: string; revenue: number }[];
}

export default function WeeklySalesChart({ data }: WeeklySalesChartProps) {
  const chartData =
    data && data.length > 0
      ? data
      : [
          { day: "Mon", revenue: 0 },
          { day: "Tue", revenue: 0 },
          { day: "Wed", revenue: 0 },
          { day: "Thu", revenue: 0 },
          { day: "Fri", revenue: 0 },
          { day: "Sat", revenue: 0 },
          { day: "Sun", revenue: 0 },
        ];

  // Resolve current day in UTC+7 (Cambodia)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayKey = dayNames[new Date(Date.now() + 7 * 60 * 60 * 1000).getUTCDay()];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 10);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} barCategoryGap="28%">
        <defs>
          <linearGradient id="todayBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF2E43" stopOpacity={1} />
            <stop offset="100%" stopColor="#9C0F1F" stopOpacity={0.85} />
          </linearGradient>
          <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4162A" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#660a12" stopOpacity={0.75} />
          </linearGradient>
          <linearGradient id="emptyBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.08)" stopOpacity={1} />
            <stop offset="100%" stopColor="rgba(255,255,255,0.02)" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={({ x, y, payload }) => {
            const isToday = payload.value === todayKey;
            return (
              <text
                x={x}
                y={Number(y) + 14}
                textAnchor="middle"
                fill={isToday ? "#FF2E43" : "#adb6c4"}
                fontWeight={isToday ? 700 : 500}
                fontSize={11}
                fontFamily="JetBrains Mono, monospace"
              >
                {payload.value}
                {isToday ? " •" : ""}
              </text>
            );
          }}
        />
        <YAxis hide domain={[0, Math.ceil(maxRevenue * 1.15)]} />
        <Tooltip
          cursor={{ fill: "rgba(229,9,20,0.08)" }}
          contentStyle={{
            background: "#14161d",
            border: "1px solid rgba(228,22,42,0.35)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            color: "#e3e2e8",
            fontSize: 12,
            padding: "8px 12px",
          }}
          formatter={(value: any) => [
            `$${Number(value || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Sales Revenue",
          ]}
          labelFormatter={(label: any) => `${label}${label === todayKey ? " (Today)" : ""}`}
        />
        <Bar dataKey="revenue" radius={[5, 5, 0, 0]} minPointSize={4}>
          {chartData.map((entry, index) => {
            const isToday = entry.day === todayKey;
            const hasRevenue = entry.revenue > 0;
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  isToday
                    ? "url(#todayBarGradient)"
                    : hasRevenue
                    ? "url(#activeBarGradient)"
                    : "url(#emptyBarGradient)"
                }
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
