import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

function formatQty(value: number) {
  // żeby 0.05 wyglądało sensownie, a całe liczby nie miały .00
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
    assets: Array<{
      id: string;
      symbol: string;
      name: string;
      quantity: number;
      price: number;
      value: number;
    }>;
  }>;
  currency: string;
}) {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
        Portfele i aktywa
      </Typography>

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
