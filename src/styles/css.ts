export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
:root {
  --mono: 'JetBrains Mono', monospace;
  --sans: 'Inter', -apple-system, sans-serif;
  --bg: #0a0a0f;
  --surface: #111118;
  --surface2: #16161f;
  --border: #1e1e2a;
  --border-light: #25253a;
  --text: #c8c8d4;
  --text-dim: #6b6b80;
  --text-bright: #e4e4ee;
  --accent: #7c8aff;
  --green: #3dd68c;
  --red: #f05c5c;
  --yellow: #e0a840;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--sans); }
::selection { background: rgba(124,138,255,0.3); }
.trow { transition: background .1s; }
.trow:hover { background: rgba(255,255,255,0.02) !important; }
.hcard { transition: border-color .15s; }
.hcard:hover { border-color: var(--border-light) !important; }
input:focus, select:focus { border-color: var(--border-light) !important; }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes spin { to { transform: rotate(360deg) } }
`;
