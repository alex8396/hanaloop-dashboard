"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Company } from "@/lib/api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EmissionsChartProps {
  companies: Company[];
}

export function EmissionsChart({ companies }: EmissionsChartProps) {
  // Aggregate data by yearMonth
  const aggregatedData = companies.reduce((acc, company) => {
    company.emissions.forEach((emission) => {
      if (!acc[emission.yearMonth]) {
        acc[emission.yearMonth] = { yearMonth: emission.yearMonth, total: 0 };
      }
      acc[emission.yearMonth].total += emission.emissions;
    });
    return acc;
  }, {} as Record<string, { yearMonth: string; total: number }>);

  // Sort chronologically
  const chartData = Object.values(aggregatedData).sort((a, b) => 
    a.yearMonth.localeCompare(b.yearMonth)
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>월별 배출량 트렌드 (tCO₂e)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="yearMonth" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                dy={10}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))"
                }} 
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
