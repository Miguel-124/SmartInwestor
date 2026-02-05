import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

const toNumber = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const normalized = v.replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : v;
  }
  return v;
};

const createSchema = (maxQuantity: number) =>
  z.object({
    quantity: z.preprocess(
      toNumber,
      z
        .number()
        .positive("Ilość musi być > 0")
        .max(maxQuantity, "Nie możesz sprzedać więcej niż posiadasz"),
    ),
    soldAt: z
      .string()
      .regex(/^(\d{4}-\d{2}-\d{2})$/, "Podaj datę w formacie RRRR-MM-DD"),
  });

type FormInput = z.input<ReturnType<typeof createSchema>>;
type FormOutput = z.output<ReturnType<typeof createSchema>>;

export function SellAssetDialog({
  open,
  title,
  submitText,
  maxQuantity,
  assetName,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  title: string;
  submitText: string;
  maxQuantity: number;
  assetName?: string;
  onClose: () => void;
  onSubmit: (values: FormOutput) => void;
  loading?: boolean;
}) {
  const schema = React.useMemo(() => createSchema(maxQuantity), [maxQuantity]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      quantity: Math.min(1, maxQuantity || 1),
      soldAt: new Date().toISOString().slice(0, 10),
    } as FormInput,
  });

  React.useEffect(() => {
    if (!open) return;
    reset({
      quantity: Math.min(1, maxQuantity || 1),
      soldAt: new Date().toISOString().slice(0, 10),
    } as FormInput);
  }, [open, maxQuantity, reset]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset({
          quantity: Math.min(1, maxQuantity || 1),
          soldAt: new Date().toISOString().slice(0, 10),
        } as FormInput);
        onClose();
      }}
      aria-label="sell-asset-dialog"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit((v) => onSubmit(v))}
          noValidate
          id="sell-asset-form"
        >
          <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 280, sm: 420 } }}>
            {assetName ? (
              <Typography variant="body2" color="text.secondary">
                Sprzedaż: {assetName}
              </Typography>
            ) : null}

            <TextField
              label="Ilość"
              error={!!errors.quantity}
              helperText={errors.quantity?.message}
              inputProps={{ "aria-label": "Ilość" }}
              type="number"
              fullWidth
              {...register("quantity")}
            />

            <TextField
              label="Data sprzedaży"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.soldAt}
              helperText={errors.soldAt?.message}
              inputProps={{ "aria-label": "Data sprzedaży" }}
              fullWidth
              {...register("soldAt")}
            />

            <Typography variant="caption" color="text.secondary">
              Dostępne: {maxQuantity}
            </Typography>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset({
              quantity: Math.min(1, maxQuantity || 1),
              soldAt: new Date().toISOString().slice(0, 10),
            } as FormInput);
            onClose();
          }}
          disabled={loading}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          form="sell-asset-form"
          variant="contained"
          disabled={loading}
          aria-label="sell-asset-submit"
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
