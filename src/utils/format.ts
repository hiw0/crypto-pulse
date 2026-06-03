export const fmt = (n: number | null | undefined): string => {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toLocaleString();
};

export const pct = (n: number | null | undefined): string => {
  if (n == null) return "—";
  return (n >= 0 ? "+" : "") + (Math.abs(n) > 999 ? fmt(Math.abs(n)) : n.toFixed(1)) + "%";
};

export const sCol = (c: number | null | undefined): string => {
  if (c == null) return "#64748b";
  if (c > 100) return "#e0a840";
  if (c > 30) return "#3dd68c";
  if (c > 0) return "#3dd68c";
  if (c > -30) return "#f05c5c";
  return "#f05c5c";
};

export const sLbl = (c: number | null | undefined): string => {
  if (c == null) return "—";
  if (c > 100) return "EXPLOSIVE";
  if (c > 50) return "V.Bullish";
  if (c > 20) return "Bullish";
  if (c > 0) return "Sl. Bullish";
  if (c > -20) return "Sl. Bearish";
  if (c > -50) return "Bearish";
  return "V.Bearish";
};

export const tagColors: Record<string, string> = {
  Institutional: "#818cf8",
  "Price Action": "#3dd68c",
  ETH: "#627EEA",
  SOL: "#9945FF",
  Security: "#f05c5c",
  Stablecoins: "#2dd4bf",
  Culture: "#e0a840",
  "On-Chain": "#a78bfa",
  Geopolitical: "#fb923c",
};
