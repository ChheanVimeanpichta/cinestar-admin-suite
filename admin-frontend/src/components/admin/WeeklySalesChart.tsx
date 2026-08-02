import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface WeeklySalesChartProps {
  data: { day: string; revenue: number }[];
}

export default function WeeklySalesChart({ data }: WeeklySalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#adb6c4", fontSize: 11, fontFamily: "JetBrains Mono" }}
        />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "rgba(229,9,20,0.08)" }}
          contentStyle={{
            background: "#121317",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#e3e2e8",
            fontSize: 12,
          }}
        />
        <Bar dataKey="revenue" fill="#7a0d12" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
