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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nazwa portfela musi mieć co najmniej 2 znaki"),
});

type FormValues = z.infer<typeof schema>;

export function PortfolioDialog({
  open,
  initialName,
  title,
  submitText,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  initialName?: string;
  title: string;
  submitText: string;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void;
  loading?: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { name: initialName ?? "" },
  });

  React.useEffect(() => {
    if (!open) return;
    reset({ name: initialName ?? "" });
  }, [open, initialName, reset]);

  return (
    <Dialog open={open} onClose={onClose} aria-label="portfolio-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={handleSubmit((v) => onSubmit({ name: v.name.trim() }))}
          noValidate
          id="portfolio-form"
        >
          <Stack spacing={2} sx={{ mt: 1, minWidth: { xs: 280, sm: 420 } }}>
            <TextField
              label="Nazwa portfela"
              error={!!errors.name}
              helperText={errors.name?.message}
              inputProps={{ "aria-label": "Nazwa portfela" }}
              {...register("name")}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Anuluj
        </Button>
        <Button
          type="submit"
          form="portfolio-form"
          variant="contained"
          disabled={loading}
          aria-label="portfolio-submit"
        >
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
