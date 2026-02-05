import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SellIcon from "@mui/icons-material/Sell";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Link as RouterLink } from "react-router-dom";
import { useProfileQuery } from "../../profile/api/hooks";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";

import { PortfolioDialog } from "../components/PortfolioDialog";
import { AssetDialog } from "../components/AssetDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SellAssetDialog } from "../components/SellAssetDialog";

import {
  useAddAssetMutation,
  useCreatePortfolioMutation,
  useDeleteAssetMutation,
  useDeletePortfolioMutation,
  usePortfoliosQuery,
  useSellAssetMutation,
  useUpdateAssetMutation,
  useUpdatePortfolioMutation,
} from "../api/hooks";
import type { PortfolioModel } from "../types";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

function formatQty(value: number) {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 6 }).format(
    value,
  );
}

function formatPurchaseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");

  return `${dd}.${mm}.${y}`;
}

function ChangeIndicator({
  changeValue,
  changePercent,
  currency,
}: {
  changeValue: number;
  changePercent: number;
  currency: string;
}) {
  const isPositive = changeValue >= 0;
  const color = isPositive ? "success.main" : "error.main";
  const Icon = isPositive ? ArrowUpwardIcon : ArrowDownwardIcon;

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Icon sx={{ fontSize: 16, color }} />
      <Typography sx={{ color, fontWeight: 700 }} variant="body2">
        {formatMoney(Math.abs(changeValue), currency)} (
        {Math.abs(changePercent).toFixed(2)}
        %)
      </Typography>
    </Stack>
  );
}

export function PortfoliosPage() {
  const portfoliosQuery = usePortfoliosQuery();
  const profileQuery = useProfileQuery();
  const createPortfolio = useCreatePortfolioMutation();
  const updatePortfolio = useUpdatePortfolioMutation();
  const deletePortfolio = useDeletePortfolioMutation();

  const addAsset = useAddAssetMutation();
  const updateAsset = useUpdateAssetMutation();
  const deleteAsset = useDeleteAssetMutation();
  const sellAsset = useSellAssetMutation();

  const [createOpen, setCreateOpen] = React.useState(false);

  const [editPortfolio, setEditPortfolio] =
    React.useState<PortfolioModel | null>(null);
  const [deletePortfolioTarget, setDeletePortfolioTarget] =
    React.useState<PortfolioModel | null>(null);

  const [assetTarget, setAssetTarget] = React.useState<{
    portfolio: PortfolioModel;
    assetId?: string;
  } | null>(null);
  const [deleteAssetTarget, setDeleteAssetTarget] = React.useState<{
    portfolioId: string;
    assetId: string;
  } | null>(null);
  const [sellAssetTarget, setSellAssetTarget] = React.useState<{
    portfolio: PortfolioModel;
    assetId: string;
  } | null>(null);
  const [expandedAssets, setExpandedAssets] = React.useState<
    Record<string, string | null>
  >({});

  const baseCurrency =
    (profileQuery.data?.baseCurrency as CurrencyCode | undefined) ?? "USD";
  const fxQuery = useFxRates(baseCurrency);

  const isLoading =
    portfoliosQuery.isLoading || profileQuery.isLoading || fxQuery.isLoading;
  const isError =
    portfoliosQuery.isError || profileQuery.isError || fxQuery.isError;

  if (isLoading) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ py: 6 }}
        aria-label="Portfolios loading"
      >
        <CircularProgress />
        <Typography color="text.secondary">Ładowanie portfeli...</Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" aria-label="Portfolios error">
        {(portfoliosQuery.error as Error).message ||
          (fxQuery.error as Error | undefined)?.message ||
          "Nie udało się pobrać portfeli."}
      </Alert>
    );
  }

  const portfolios = portfoliosQuery.data ?? [];

  const displayPortfolios = portfolios.map((p) => {
    const assets = p.assets.map((a) => ({
      ...a,
      price: convertToBase(a.price, a.currency, baseCurrency, fxQuery.data),
      value: convertToBase(a.value, a.currency, baseCurrency, fxQuery.data),
      marketPrice: convertToBase(
        a.marketPrice ?? a.price,
        a.currency,
        baseCurrency,
        fxQuery.data,
      ),
      marketValue: convertToBase(
        a.marketValue ?? a.value,
        a.currency,
        baseCurrency,
        fxQuery.data,
      ),
    }));

    const totalValue = assets.reduce((acc, a) => acc + a.value, 0);
    const marketValue = assets.reduce((acc, a) => acc + a.marketValue, 0);
    const changeValue = marketValue - totalValue;
    const changePercent = totalValue > 0 ? (changeValue / totalValue) * 100 : 0;

    return {
      ...p,
      totalValue,
      marketValue,
      changeValue,
      changePercent,
      assets,
    };
  });

  return (
    <Stack spacing={3} aria-label="Portfolios page">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 950 }}>
              Portfele
            </Typography>
            <Tooltip title="Sekcja zarządzania portfelami i aktywami. Szczegółowy opis w instrukcji.">
              <IconButton size="small" aria-label="Pomoc: Portfele">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography color="text.secondary">
            Zarządzaj portfelami i aktywami. Dodawaj, edytuj i usuwaj pozycje.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            component={RouterLink}
            to="/profile/help#instrukcja-portfele"
            variant="outlined"
            size="small"
            aria-label="Instrukcja portfeli"
          >
            Instrukcja
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            aria-label="Dodaj portfel"
          >
            Dodaj portfel
          </Button>
        </Stack>
      </Stack>

      {portfolios.length === 0 ? (
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontWeight: 900, mb: 1 }}>Brak portfeli</Typography>
          <Typography color="text.secondary">
            Utwórz pierwszy portfel, aby dodać aktywa i zobaczyć wyniki na
            dashboardzie.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {displayPortfolios.map((p) => (
            <Accordion
              key={p.id}
              defaultExpanded
              disableGutters
              sx={{ borderRadius: 1, overflow: "hidden" }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label={`portfolio-${p.id}`}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 900 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Wartość: {formatMoney(p.totalValue, baseCurrency)} •
                      Wartość rynkowa:{" "}
                      {formatMoney(p.marketValue, baseCurrency)} • Aktywów:{" "}
                      {p.assets.length}
                    </Typography>
                    <ChangeIndicator
                      changeValue={p.changeValue}
                      changePercent={p.changePercent}
                      currency={baseCurrency}
                    />
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip title="Dodaj aktywo">
                      <IconButton
                        aria-label="Dodaj aktywo"
                        onClick={() => setAssetTarget({ portfolio: p })}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edytuj portfel">
                      <IconButton
                        aria-label="Edytuj portfel"
                        onClick={() => setEditPortfolio(p)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Usuń portfel">
                      <IconButton
                        aria-label="Usuń portfel"
                        onClick={() => setDeletePortfolioTarget(p)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </AccordionSummary>

              <AccordionDetails>
                <Box>
                  <Table
                    size="small"
                    aria-label={`assets-table-${p.id}`}
                    sx={{
                      tableLayout: "fixed",
                      "& th, & td": { whiteSpace: "nowrap" },
                      "& td:first-of-type": { whiteSpace: "normal" },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, width: 34 }} />
                        <TableCell sx={{ fontWeight: 800, width: 220 }}>
                          Nazwa
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, width: 110 }}>
                          Symbol
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 80 }}
                          align="right"
                        >
                          Ilość
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 160 }}
                          align="right"
                        >
                          Wartość rynkowa
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 160 }}
                          align="right"
                        >
                          Zmiana
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 140 }}
                          align="right"
                        >
                          Akcje
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {p.assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Typography color="text.secondary">
                              Brak aktywów w tym portfelu. Kliknij „Dodaj
                              aktywo”.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        p.assets.map((a) => {
                          const isExpanded = expandedAssets[p.id] === a.id;

                          return (
                            <React.Fragment key={a.id}>
                              <TableRow
                                hover
                                onClick={() =>
                                  setExpandedAssets((prev) => ({
                                    ...prev,
                                    [p.id]: prev[p.id] === a.id ? null : a.id,
                                  }))
                                }
                                sx={{ cursor: "pointer" }}
                              >
                                <TableCell>
                                  <IconButton
                                    size="small"
                                    aria-label={
                                      isExpanded
                                        ? "Zwiń szczegóły"
                                        : "Rozwiń szczegóły"
                                    }
                                  >
                                    <ExpandMoreIcon
                                      sx={{
                                        transform: isExpanded
                                          ? "rotate(180deg)"
                                          : "rotate(0deg)",
                                        transition: "transform 0.2s ease",
                                      }}
                                    />
                                  </IconButton>
                                </TableCell>
                                <TableCell>{a.name}</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>
                                  {a.symbol}
                                </TableCell>
                                <TableCell align="right">
                                  {formatQty(a.quantity)}
                                </TableCell>
                                <TableCell align="right">
                                  {formatMoney(a.marketValue, baseCurrency)}
                                </TableCell>
                                <TableCell align="right">
                                  <ChangeIndicator
                                    changeValue={a.marketValue - a.value}
                                    changePercent={
                                      a.value > 0
                                        ? ((a.marketValue - a.value) /
                                            a.value) *
                                          100
                                        : 0
                                    }
                                    currency={baseCurrency}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    justifyContent="flex-end"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Tooltip title="Edytuj aktywo">
                                      <IconButton
                                        aria-label="Edytuj aktywo"
                                        onClick={() =>
                                          setAssetTarget({
                                            portfolio: p,
                                            assetId: a.id,
                                          })
                                        }
                                        size="small"
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Sprzedaj aktywo">
                                      <IconButton
                                        aria-label="Sprzedaj aktywo"
                                        onClick={() =>
                                          setSellAssetTarget({
                                            portfolio: p,
                                            assetId: a.id,
                                          })
                                        }
                                        size="small"
                                      >
                                        <SellIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Usuń aktywo">
                                      <IconButton
                                        aria-label="Usuń aktywo"
                                        onClick={() =>
                                          setDeleteAssetTarget({
                                            portfolioId: p.id,
                                            assetId: a.id,
                                          })
                                        }
                                        size="small"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                              {isExpanded && (
                                <TableRow>
                                  <TableCell colSpan={7}>
                                    <Stack
                                      spacing={1}
                                      sx={{
                                        p: 1.5,
                                        backgroundColor: "action.hover",
                                        borderRadius: 0.5,
                                      }}
                                    >
                                      <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={2}
                                      >
                                        <Typography variant="body2">
                                          <strong>Waluta:</strong> {a.currency}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Data zakupu:</strong>{" "}
                                          {formatPurchaseDate(a.purchasedAt)}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Cena (bazowa):</strong>{" "}
                                          {formatMoney(a.price, baseCurrency)}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Wartość (bazowa):</strong>{" "}
                                          {formatMoney(a.value, baseCurrency)}
                                        </Typography>
                                      </Stack>
                                      <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        spacing={2}
                                      >
                                        <Typography variant="body2">
                                          <strong>Cena rynkowa:</strong>{" "}
                                          {formatMoney(
                                            a.marketPrice,
                                            baseCurrency,
                                          )}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Wartość rynkowa:</strong>{" "}
                                          {formatMoney(
                                            a.marketValue,
                                            baseCurrency,
                                          )}
                                        </Typography>
                                        <Typography variant="body2">
                                          <strong>Zmiana:</strong>{" "}
                                          {formatMoney(
                                            a.marketValue - a.value,
                                            baseCurrency,
                                          )}{" "}
                                          (
                                          {a.value > 0
                                            ? (
                                                ((a.marketValue - a.value) /
                                                  a.value) *
                                                100
                                              ).toFixed(2)
                                            : "0.00"}
                                          % )
                                        </Typography>
                                      </Stack>
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              )}
                            </React.Fragment>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      {/* CREATE PORTFOLIO */}
      <PortfolioDialog
        open={createOpen}
        title="Dodaj portfel"
        submitText="Dodaj"
        onClose={() => setCreateOpen(false)}
        loading={createPortfolio.isPending}
        onSubmit={async (values) => {
          await createPortfolio.mutateAsync({ name: values.name });
          setCreateOpen(false);
        }}
      />

      {/* EDIT PORTFOLIO */}
      <PortfolioDialog
        open={!!editPortfolio}
        title="Edytuj portfel"
        submitText="Zapisz"
        initialName={editPortfolio?.name}
        onClose={() => setEditPortfolio(null)}
        loading={updatePortfolio.isPending}
        onSubmit={async (values) => {
          if (!editPortfolio) return;
          await updatePortfolio.mutateAsync({
            id: editPortfolio.id,
            body: { name: values.name },
          });
          setEditPortfolio(null);
        }}
      />

      {/* DELETE PORTFOLIO */}
      <ConfirmDialog
        open={!!deletePortfolioTarget}
        title="Usuń portfel"
        description={`Czy na pewno chcesz usunąć portfel "${deletePortfolioTarget?.name}"? Tej operacji nie da się cofnąć.`}
        onClose={() => setDeletePortfolioTarget(null)}
        loading={deletePortfolio.isPending}
        onConfirm={async () => {
          if (!deletePortfolioTarget) return;
          await deletePortfolio.mutateAsync(deletePortfolioTarget.id);
          setDeletePortfolioTarget(null);
        }}
      />

      {/* ASSET DIALOG (ADD/EDIT) */}
      <AssetDialog
        open={!!assetTarget}
        title={assetTarget?.assetId ? "Edytuj aktywo" : "Dodaj aktywo"}
        submitText={assetTarget?.assetId ? "Zapisz" : "Dodaj"}
        initialValues={
          assetTarget?.assetId
            ? assetTarget.portfolio.assets.find(
                (a) => a.id === assetTarget.assetId,
              )
            : undefined
        }
        onClose={() => setAssetTarget(null)}
        loading={addAsset.isPending || updateAsset.isPending}
        onSubmit={async (values) => {
          if (!assetTarget) return;

          if (assetTarget.assetId) {
            await updateAsset.mutateAsync({
              portfolioId: assetTarget.portfolio.id,
              assetId: assetTarget.assetId,
              body: values,
            });
          } else {
            await addAsset.mutateAsync({
              portfolioId: assetTarget.portfolio.id,
              body: values,
            });
          }

          setAssetTarget(null);
        }}
      />

      {/* DELETE ASSET */}
      <ConfirmDialog
        open={!!deleteAssetTarget}
        title="Usuń aktywo"
        description="Czy na pewno chcesz usunąć to aktywo?"
        onClose={() => setDeleteAssetTarget(null)}
        loading={deleteAsset.isPending}
        onConfirm={async () => {
          if (!deleteAssetTarget) return;
          await deleteAsset.mutateAsync(deleteAssetTarget);
          setDeleteAssetTarget(null);
        }}
      />

      {/* SELL ASSET */}
      <SellAssetDialog
        open={!!sellAssetTarget}
        title="Sprzedaj aktywo"
        submitText="Sprzedaj"
        assetName={
          sellAssetTarget?.portfolio.assets.find(
            (a) => a.id === sellAssetTarget.assetId,
          )?.name
        }
        maxQuantity={
          sellAssetTarget?.portfolio.assets.find(
            (a) => a.id === sellAssetTarget.assetId,
          )?.quantity ?? 0
        }
        onClose={() => setSellAssetTarget(null)}
        loading={sellAsset.isPending}
        onSubmit={async (values) => {
          if (!sellAssetTarget) return;
          await sellAsset.mutateAsync({
            portfolioId: sellAssetTarget.portfolio.id,
            assetId: sellAssetTarget.assetId,
            body: values,
          });
          setSellAssetTarget(null);
        }}
      />
    </Stack>
  );
}
