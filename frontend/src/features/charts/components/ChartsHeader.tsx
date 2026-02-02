import {
  Box,
  // Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { ChartsRange } from "../types";

export function ChartsHeader({
  range,
  points,
  onRangeChange,
  onPointsChange,
  // onRefresh,
}: {
  range: ChartsRange;
  points: number;
  onRangeChange: (v: ChartsRange) => void;
  onPointsChange: (v: number) => void;
  onRefresh: () => void;
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Wykresy
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
            Szczegółowy podgląd historii wartości — łącznie i per portfel.
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.8, minWidth: 60 }}>
              Zakres
            </Typography>
            <Select
              size="small"
              value={range}
              onChange={(e) => onRangeChange(e.target.value as ChartsRange)}
              inputProps={{ "aria-label": "Zakres wykresu" }}
            >
              <MenuItem value="6m">6 miesięcy</MenuItem>
              <MenuItem value="12m">12 miesięcy</MenuItem>
              <MenuItem value="all">Cała historia</MenuItem>
            </Select>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ opacity: 0.8, minWidth: 60 }}>
              Punkty
            </Typography>
            <Select
              size="small"
              value={points}
              onChange={(e) => onPointsChange(Number(e.target.value))}
              inputProps={{ "aria-label": "Liczba punktów" }}
            >
              {[10, 15, 20, 25].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          {/* <Button
            variant="contained"
            onClick={onRefresh}
            aria-label="Odśwież wykresy"
          >
            Odśwież
          </Button> */}
        </Stack>
      </Stack>
    </Paper>
  );
}
