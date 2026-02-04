import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ReactNode } from "react";

export type PieItem = { name: string; value: number };

type PieChartCardProps = {
  title: ReactNode;
  subtitle?: string;
  items: PieItem[];
  currency: string;
};

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

export function PieChartCard({
  title,
  subtitle,
  items,
  currency,
}: PieChartCardProps) {
  const theme = useTheme();
  const total = items.reduce((acc, item) => acc + item.value, 0);

  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Typography color="text.secondary">
          Brak danych do wyświetlenia.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Box sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={2}
              stroke="none"
            >
              {items.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const numeric = Number(value) || 0;
                const percent = total > 0 ? (numeric / total) * 100 : 0;
                return [
                  `${formatMoney(numeric, currency)} (${percent.toFixed(1)}%)`,
                  name,
                ];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
