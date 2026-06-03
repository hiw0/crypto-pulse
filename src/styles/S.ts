import type { CSSProperties } from 'react';

export const S: Record<string, CSSProperties> = {
  root: { fontFamily: "var(--sans)", color: "var(--text)", background: "var(--bg)", minHeight: "100vh" },

  // Header
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--surface)" },
  hL: { display: "flex", alignItems: "center", gap: 10 },
  logo: { fontSize: 14, fontFamily: "var(--mono)", fontWeight: 600, color: "var(--accent)", letterSpacing: 1 },
  logoS: { fontSize: 11, color: "var(--text-dim)", marginTop: 1 },
  hR: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" },
  pill: { fontSize: 11, fontFamily: "var(--mono)", fontWeight: 500, color: "var(--text)", background: "var(--surface2)", padding: "4px 10px", borderRadius: 4 },

  // Nav
  nav: { display: "flex", gap: 0, borderBottom: "1px solid var(--border)", background: "var(--surface)", overflowX: "auto", padding: "0 16px" },
  nb: { padding: "10px 14px", border: "none", borderBottom: "2px solid transparent", background: "transparent", color: "var(--text-dim)", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "var(--sans)", transition: "color .15s" },
  na: { color: "var(--text-bright)", borderBottomColor: "var(--accent)" },

  // Main
  main: { padding: "20px", maxWidth: 1200, margin: "0 auto", animation: "fadeIn .2s ease" },

  // Stat cards
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10, marginBottom: 16 },
  statCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 14px" },
  statLabel: { fontSize: 10, fontFamily: "var(--mono)", fontWeight: 500, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  statVal: { fontSize: 18, fontFamily: "var(--mono)", fontWeight: 600, color: "var(--text-bright)" },
  statChg: { fontSize: 12, fontFamily: "var(--mono)", fontWeight: 500, marginTop: 2 },

  // Macro
  macroBox: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 20 },
  macroHead: { fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  macroText: { fontSize: 13, color: "var(--text)", lineHeight: 1.7, marginBottom: 12 },
  macroEvents: { display: "flex", flexDirection: "column", gap: 6 },
  macroEvent: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontFamily: "var(--mono)", color: "var(--text)" },
  evDot: { width: 6, height: 6, borderRadius: "50%", background: "var(--red)", flexShrink: 0 },

  // Signals
  alertCard: { display: "flex", gap: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 14, marginBottom: 8 },
  aI: { fontSize: 18, flexShrink: 0, lineHeight: 1 },
  aT: { fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, marginBottom: 2 },
  aB: { fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 },
  sGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginTop: 12 },
  sCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 16 },
  sH: { display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--mono)", fontSize: 10, fontWeight: 600, color: "var(--text-dim)", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  sD: { fontSize: 11, color: "var(--text-dim)", marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  sR: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid var(--border)" },
  sRk: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", width: 16 },
  sTk: { fontFamily: "var(--mono)", fontWeight: 600, fontSize: 12, width: 70 },
  sBar: { height: 4, borderRadius: 2, minWidth: 3 },
  sP: { fontFamily: "var(--mono)", fontWeight: 600, fontSize: 11, width: 72, textAlign: "right" },
  sM: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--text-dim)", width: 44, textAlign: "right" },

  // Table
  tbl: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "8px 10px", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-dim)", fontFamily: "var(--mono)", borderBottom: "1px solid var(--border)" },
  td: { padding: "8px 10px", fontSize: 12, borderBottom: "1px solid var(--border)" },
  bT: { height: 4, background: "var(--surface2)", borderRadius: 2, overflow: "hidden" },
  bF: { height: "100%", borderRadius: 2 },
  chBdg: { fontSize: 10, fontWeight: 500, padding: "2px 8px", borderRadius: 3, fontFamily: "var(--mono)" },
  cpBtn: { marginLeft: 6, fontSize: 10, fontFamily: "var(--mono)", color: "var(--accent)", background: "transparent", border: "1px solid var(--border)", borderRadius: 3, padding: "1px 5px", cursor: "pointer" },

  // Events
  evGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 10 },
  evCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 16 },
  evTag: { fontSize: 10, fontFamily: "var(--mono)", fontWeight: 500, padding: "2px 8px", borderRadius: 3 },
  evText: { fontSize: 13, color: "var(--text)", lineHeight: 1.65, marginBottom: 10 },
  evLink: { fontSize: 11, fontFamily: "var(--mono)", color: "var(--accent)", textDecoration: "none" },

  // Narratives
  narGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 10 },
  narCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 16 },
  narN: { fontFamily: "var(--mono)", fontSize: 10, fontWeight: 500, color: "var(--text-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  narT: { fontSize: 13, lineHeight: 1.65, marginBottom: 12, color: "var(--text)" },
  narL: { display: "flex", gap: 6, flexWrap: "wrap" },
  nLink: { fontSize: 10, fontFamily: "var(--mono)", color: "var(--accent)", textDecoration: "none", padding: "3px 8px", background: "var(--surface2)", borderRadius: 3, border: "1px solid var(--border)" },

  // Mentions
  secTitle: { fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  mentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 },
  mentCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 14 },
  mentAcct: { fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: "var(--text-bright)" },
  smartBadge: { fontSize: 10, fontFamily: "var(--mono)", color: "var(--accent)", background: "var(--surface2)", padding: "2px 8px", borderRadius: 3 },
  mentStats: { display: "flex", gap: 12, fontSize: 11, color: "var(--text-dim)", margin: "10px 0" },

  // Smart Stats
  smartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 },
  smartCard: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: 16 },
  smartUser: { fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--text-bright)", marginBottom: 12 },
  smartRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" },
  smartLabel: { fontSize: 12, color: "var(--text-dim)" },
  smartVal: { fontSize: 12, fontFamily: "var(--mono)", fontWeight: 600, color: "var(--text-bright)" },

  // Footer
  ft: { textAlign: "center", padding: "16px 20px", fontSize: 11, color: "var(--text-dim)", borderTop: "1px solid var(--border)" },

  // Loading / Error
  loadWrap: { display: "flex", justifyContent: "center", alignItems: "center", padding: 48 },
  loadText: { fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-dim)" },
  errWrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 48 },
  errText: { fontSize: 12, color: "var(--red)" },
  retryBtn: { padding: "6px 16px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)", fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer" },
};
