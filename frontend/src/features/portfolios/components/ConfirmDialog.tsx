import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Usuń",
  cancelText = "Anuluj",
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} aria-label="confirm-dialog">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          aria-label="confirm-delete"
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
