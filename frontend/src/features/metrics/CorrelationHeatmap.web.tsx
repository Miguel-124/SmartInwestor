import React from "react";

export default function CorrelationHeatmap({
  labels,
  matrix,
}: {
  labels: string[];
  matrix: number[][];
}) {
  const color = (v: number) => {
    // v ∈ [-1,1] → kolor HSL (czerwony do zielonego)
    const clamped = Math.max(-1, Math.min(1, v));
    const hue = ((clamped + 1) / 2) * 120; // -1 → 0 (red), 1 → 120 (green)
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `120px repeat(${labels.length}, minmax(0,1fr))`,
        gap: 2,
      }}
    >
      <div />
      {labels.map((l) => (
        <div
          key={`col-${l}`}
          style={{ fontSize: 12, opacity: 0.7, textAlign: "center" }}
        >
          {l}
        </div>
      ))}
      {matrix.map((row, i) => (
        <React.Fragment key={`row-${i}`}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{labels[i]}</div>
          {row.map((v, j) => (
            <div
              key={`cell-${i}-${j}`}
              title={`${labels[i]} × ${labels[j]}: ${v.toFixed(2)}`}
              style={{
                height: 24,
                background: color(v),
                textAlign: "center",
                fontSize: 10,
                color: "#111",
              }}
            >
              {v.toFixed(2)}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
