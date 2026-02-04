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
import { Link as RouterLink } from "react-router-dom";
import { useProfileQuery } from "../../profile/api/hooks";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";

import { PortfolioDialog } from "../components/PortfolioDialog";
import { AssetDialog } from "../components/AssetDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";

import {
  useAddAssetMutation,
  useCreatePortfolioMutation,
  useDeleteAssetMutation,
  useDeletePortfolioMutation,
  usePortfoliosQuery,
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

  // const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  // const monthName = new Intl.DateTimeFormat("pl-PL", { month: "short" }).format(
  //   date,
  // );

  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");

  return `${dd}.${mm}.${y}`;
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
    }));

    const totalValue = assets.reduce((acc, a) => acc + a.value, 0);

    return {
      ...p,
      totalValue,
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
                      Aktywów: {p.assets.length}
                    </Typography>
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
                <Box sx={{ overflowX: "auto" }}>
                  <Table
                    size="small"
                    aria-label={`assets-table-${p.id}`}
                    sx={{
                      minWidth: 920,
                      tableLayout: "fixed",
                      "& th, & td": { whiteSpace: "nowrap" },
                      "& td:first-of-type": { whiteSpace: "normal" },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, width: 320 }}>
                          Nazwa
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, width: 110 }}>
                          Symbol
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, width: 90 }}>
                          Waluta
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, width: 120 }}>
                          Data zakupu
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 110 }}
                          align="right"
                        >
                          Ilość
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 140 }}
                          align="right"
                        >
                          Cena (bazowa)
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 160 }}
                          align="right"
                        >
                          Wartość (bazowa)
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 800, width: 120 }}
                          align="right"
                        >
                          Akcje
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {p.assets.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Typography color="text.secondary">
                              Brak aktywów w tym portfelu. Kliknij „Dodaj
                              aktywo”.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        p.assets.map((a) => (
                          <TableRow key={a.id} hover>
                            <TableCell>{a.name}</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>
                              {a.symbol}
                            </TableCell>
                            <TableCell>{a.currency}</TableCell>
                            <TableCell>
                              {formatPurchaseDate(a.purchasedAt)}
                            </TableCell>
                            <TableCell align="right">
                              {formatQty(a.quantity)}
                            </TableCell>
                            <TableCell align="right">
                              {formatMoney(a.price, baseCurrency)}
                            </TableCell>
                            <TableCell align="right">
                              {formatMoney(a.value, baseCurrency)}
                            </TableCell>
                            <TableCell align="right">
                              <Stack
                                direction="row"
                                spacing={1}
                                justifyContent="flex-end"
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
                        ))
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
    </Stack>
  );
}
