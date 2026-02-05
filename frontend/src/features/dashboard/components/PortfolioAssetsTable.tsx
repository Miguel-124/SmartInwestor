import React from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

function formatQty(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 6,
  }).format(value);
}

export function PortfolioAssetsTable({
  portfolios,
  currency,
}: {
  portfolios: Array<{
    id: string;
    name: string;
    totalValue: number;
    marketValue: number;
    changeValue: number;
    changePercent: number;
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
      marketValue: number;
      changeValue: number;
      changePercent: number;
    }>;
  }>;
  currency: string;
}) {
  const renderChange = (changeValue: number, changePercent: number) => {
    const isPositive = changeValue >= 0;
    const color = isPositive ? "success.main" : "error.main";
    const Icon = isPositive ? ArrowUpwardIcon : ArrowDownwardIcon;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Icon sx={{ fontSize: 16, color }} />
        <Typography sx={{ color, fontWeight: 700 }} variant="body2">
          {formatMoney(Math.abs(changeValue), currency)} (
          {Math.abs(changePercent).toFixed(2)}
          %)
        </Typography>
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Portfele i aktywa
        </Typography>
        <Tooltip title="Tabela prezentuje aktywa w każdym portfelu wraz z ilościami i wyceną w wybranej walucie.">
          <IconButton size="small" aria-label="Pomoc: Portfele i aktywa">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ overflowX: "auto" }} aria-label="Tabela portfeli i aktywów">
        <Table
          size="small"
          aria-label="Portfele i aktywa"
          sx={{ minWidth: 760 }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800 }}>Pozycja</TableCell>
              <TableCell sx={{ fontWeight: 800 }}>Symbol</TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Ilość
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Cena
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Wartość
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Wartość rynkowa
              </TableCell>
              <TableCell sx={{ fontWeight: 800 }} align="right">
                Zmiana
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {portfolios.map((p) => (
              <React.Fragment key={p.id}>
                {/* Wiersz portfela (nazwa + suma w ostatniej kolumnie) */}
                <TableRow
                  sx={{
                    backgroundColor: "action.hover",
                    "& td": { py: 1.6 },
                  }}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                      {p.name}
                    </Typography>
                  </TableCell>

                  {/* 3 puste komórki, żeby suma wylądowała w kolumnie "Wartość" */}
                  <TableCell />
                  <TableCell />
                  <TableCell />

                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                      {formatMoney(p.totalValue, currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                      {formatMoney(p.marketValue, currency)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {renderChange(p.changeValue, p.changePercent)}
                  </TableCell>
                </TableRow>

                {/* Wiersze aktywów */}
                {p.assets.map((a) => (
                  <TableRow key={a.id} hover sx={{ "& td": { py: 1.35 } }}>
                    <TableCell>
                      <Typography sx={{ pl: 1.5 }}>{a.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 800, letterSpacing: 0.2 }}>
                        {a.symbol}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">{formatQty(a.quantity)}</TableCell>
                    <TableCell align="right">
                      {formatMoney(a.price, currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(a.value, currency)}
                    </TableCell>
                    <TableCell align="right">
                      {formatMoney(a.marketValue, currency)}
                    </TableCell>
                    <TableCell align="right">
                      {renderChange(a.changeValue, a.changePercent)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
