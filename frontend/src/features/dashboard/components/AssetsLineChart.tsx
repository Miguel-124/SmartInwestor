import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

function formatMonth(d: Date) {
  return new Intl.DateTimeFormat("pl-PL", {
    month: "short",
    year: "2-digit",
  }).format(d);
}

export function AssetsLineChart({
  history,
  currency,
}: {
  history: Array<{ date: Date; totalValue: number }>;
  currency: string;
}) {
  // Recharts lubi proste obiekty (string/number)
  const data = history.map((h) => ({
    dateLabel: formatMonth(h.date),
    totalValue: h.totalValue,
  }));

  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Wartość aktywów w czasie
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Zmiany wartości łącznej od założenia konta
        </Typography>
      </Stack>

      <Box
        sx={{ width: "100%", height: 320 }}
        aria-label="Wykres liniowy wartości aktywów"
      >
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dateLabel" />
            <YAxis tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
            <Tooltip
              formatter={(v: number | undefined) =>
                formatMoney(v ?? 0, currency)
              }
            />{" "}
            <Line
              type="monotone"
              dataKey="totalValue"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
