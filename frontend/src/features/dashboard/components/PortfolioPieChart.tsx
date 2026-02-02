import { Box, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

type PieItem = { name: string; value: number };

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

export function PortfolioPieChart({
  items,
  currency,
}: {
  items: PieItem[];
  currency: string;
}) {
  const theme = useTheme();

  // prosta paleta oparta o theme (bez hardcodów “brandowych” w komponentach)
  const colors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
  ];

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
          Podział portfeli
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Udział wartości portfeli w całości
        </Typography>
      </Stack>

      <Box
        sx={{ width: "100%", height: 280 }}
        aria-label="Wykres kołowy portfeli"
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={items}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              stroke="none"
            >
              {items.map((_, idx) => (
                <Cell key={idx} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(
                value: number | undefined,
                name: string | undefined,
              ) => [formatMoney(value ?? 0, currency), name ?? ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
