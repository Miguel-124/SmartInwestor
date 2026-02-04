import { Box, IconButton, Paper, Stack, Typography, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";

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
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Podział portfeli
          </Typography>
          <Tooltip title="Wykres pokazuje udział wartości każdego portfela w łącznej wartości aktywów.">
            <IconButton size="small" aria-label="Pomoc: Podział portfeli">
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
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
            <RechartsTooltip
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
