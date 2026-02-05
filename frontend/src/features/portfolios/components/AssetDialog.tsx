import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { currencyCodes } from "../../../shared/types/currency";

const toNumber = (v: unknown) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const normalized = v.replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : v;
  }
  return v;
};

const schema = z.object({
  symbol: z.string().trim().min(1, "Symbol jest wymagany"),
  name: z.string().trim().min(1, "Nazwa jest wymagana"),
  quantity: z.preprocess(toNumber, z.number().positive("Ilość musi być > 0")),
  price: z.preprocess(toNumber, z.number().min(0, "Cena nie może być ujemna")),
  currency: z.enum(currencyCodes, {
    message: "Wybierz walutę",
  }),
  purchasedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Podaj datę w formacie RRRR-MM-DD"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.infer<typeof schema>;

export function AssetDialog({
  open,
  title,
  submitText,
  initialValues,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  title: string;
  submitText: string;
  initialValues?: Partial<FormOutput>;
  onClose: () => void;
  onSubmit: (values: FormOutput) => void;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      symbol: initialValues?.symbol ?? "",
      name: initialValues?.name ?? "",
      quantity: initialValues?.quantity ?? 1,
      price: initialValues?.price ?? 0,
      currency: initialValues?.currency ?? "PLN",
      purchasedAt:
        initialValues?.purchasedAt ?? new Date().toISOString().slice(0, 10),
    } as FormInput,
  });

  React.useEffect(() => {
    if (!open) return;
    reset({
      symbol: initialValues?.symbol ?? "",
      name: initialValues?.name ?? "",
      quantity: initialValues?.quantity ?? 1,
      price: initialValues?.price ?? 0,
      currency: initialValues?.currency ?? "PLN",
      purchasedAt:
        initialValues?.purchasedAt ?? new Date().toISOString().slice(0, 10),
    } as FormInput);
  }, [open, initialValues, reset]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset({
          symbol: initialValues?.symbol ?? "",
          name: initialValues?.name ?? "",
          quantity: initialValues?.quantity ?? 1,
          price: initialValues?.price ?? 0,
          currency: initialValues?.currency ?? "PLN",
        });
        onClose();
      }}
      aria-label="asset-dialog"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit((v) => onSubmit(v))}
          noValidate
          id="asset-form"
        >
          <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 280, sm: 460 } }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Symbol"
                error={!!errors.symbol}
                helperText={errors.symbol?.message}
                inputProps={{ "aria-label": "Symbol" }}
                fullWidth
                {...register("symbol")}
              />
              <TextField
                label="Nazwa"
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ "aria-label": "Nazwa" }}
                fullWidth
                {...register("name")}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                label="Cena"
                error={!!errors.price}
                helperText={errors.price?.message}
                inputProps={{ "aria-label": "Cena" }}
                type="number"
                fullWidth
                {...register("price")}
              />
              <TextField
                select
                label="Waluta"
                error={!!errors.currency}
                helperText={errors.currency?.message}
                inputProps={{ "aria-label": "Waluta" }}
                fullWidth
                {...register("currency")}
              >
                {currencyCodes.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Data zakupu"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.purchasedAt}
                helperText={errors.purchasedAt?.message}
                inputProps={{ "aria-label": "Data zakupu" }}
                fullWidth
                {...register("purchasedAt")}
              />
            </Stack>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            reset({
              symbol: initialValues?.symbol ?? "",
              name: initialValues?.name ?? "",
              quantity: initialValues?.quantity ?? 1,
              price: initialValues?.price ?? 0,
              currency: initialValues?.currency ?? "PLN",
              purchasedAt:
                initialValues?.purchasedAt ??
                new Date().toISOString().slice(0, 10),
            });
            onClose();
          }}
          disabled={loading}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          form="asset-form"
          variant="contained"
          disabled={loading}
          aria-label="asset-submit"
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
