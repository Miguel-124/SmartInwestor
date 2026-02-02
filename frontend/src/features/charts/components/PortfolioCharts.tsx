import { Box, Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Series = {
  id: string;
  name: string;
  history: Array<{ date: string; totalValue: number }>;
};

function formatTick(dateIso: string) {
  const d = new Date(`${dateIso}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("pl-PL", {
    month: "short",
    year: "2-digit",
  }).format(d);
}

export function PortfolioCharts({
  currency,
  series,
}: {
  currency: string;
  series: Series[];
}) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        Wykresy per portfel
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.75, mb: 3 }}>
        Każdy portfel osobno — łatwo zobaczysz, kiedy wartość rosła.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {series.map((portfolio) => {
          const data = portfolio.history.map((x) => ({
            ...x,
            dateLabel: formatTick(x.date),
          }));

          return (
            <Paper key={portfolio.id} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                {portfolio.name}
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="dateLabel" />
                    <YAxis />
                    <Tooltip
                      formatter={(v) => [
                        `${Number(v).toLocaleString("pl-PL")} ${currency}`,
                        "Wartość",
                      ]}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="totalValue"
                      strokeWidth={2}
                      dot={false}
                      name="Wartość"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
