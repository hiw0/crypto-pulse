import { useState, useEffect, useRef } from 'react';
import { S } from '../../styles/S';
import { fmt, pct } from '../../utils/format';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function SignalsTab() {
  const { data: tokens, loading, error, refetch } = useApiData(api.getTrendingTokens);
  const [selToken, setSelToken] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<ParsedSetup | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const autoLoaded = useRef(false);

  const fetchSetup = async (token: string) => {
    setSelToken(token);
    setSetupData(null);
    setSetupLoading(true);
    try {
      const res = await api.chat({ analysisType: 'tokenAnalysis', speed: 'fast', assetMetadata: { symbol: token } });
      setSetupData(parseSetup(res?.data?.message || ''));
    } catch {
      setSetupData(null);
    } finally {
      setSetupLoading(false);
    }
  };

  // Auto-load analysis for the most active token on first render
  useEffect(() => {
    if (tokens && tokens.length > 0 && !autoLoaded.current) {
      autoLoaded.current = true;
      const best = tokens.reduce((a, b) => Math.abs(a.change_percent) > Math.abs(b.change_percent) ? a : b, tokens[0]);
      fetchSetup(best.token);
    }
  }, [tokens]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && !tokens) {
    return <div style={S.loadWrap}><div style={S.loadText}>Loading signals...</div></div>;
  }
  if (error) {
    return <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>;
  }
  if (!tokens) return null;

  const bullish = tokens.filter(t => t.change_percent > 20).sort((a, b) => b.change_percent - a.change_percent);
  const bearish = tokens.filter(t => t.change_percent < -2).sort((a, b) => a.change_percent - b.change_percent);
  const neutral = tokens.filter(t => t.change_percent >= -2 && t.change_percent <= 20).sort((a, b) => b.current_count - a.current_count);

  return (
    <div>
      {/* Sentiment summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>
        <span><span style={{ color: 'var(--green)' }}>{bullish.length}</span> bullish</span>
        <span><span style={{ color: 'var(--text)' }}>{neutral.length}</span> neutral</span>
        <span><span style={{ color: 'var(--red)' }}>{bearish.length}</span> bearish</span>
        <span style={{ marginLeft: 'auto' }}>{tokens.length} tokens tracked</span>
      </div>

      {/* Signal Grids — 3 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 12 }}>
        <div style={{ ...S.sCard, borderLeft: '2px solid var(--green)' }}>
          <div style={S.sH}><span style={{ ...S.dot, background: 'var(--green)' }} />Bullish</div>
          <div style={S.sD}>Rising social attention</div>
          {bullish.map((t, i) => (
            <TokenRow key={t.token} t={t} i={i} sel={selToken} onClick={fetchSetup} colorFn={cp => cp > 100 ? 'var(--yellow)' : 'var(--green)'} barMax={200} />
          ))}
          {bullish.length === 0 && <Empty />}
        </div>
        <div style={{ ...S.sCard, borderLeft: '2px solid var(--border-light)' }}>
          <div style={S.sH}><span style={{ ...S.dot, background: 'var(--text-dim)' }} />Neutral</div>
          <div style={S.sD}>Stable mentions</div>
          {neutral.slice(0, 10).map((t, i) => (
            <TokenRow key={t.token} t={t} i={i} sel={selToken} onClick={fetchSetup} colorFn={() => 'var(--text-dim)'} barMax={200} />
          ))}
          {neutral.length === 0 && <Empty />}
        </div>
        <div style={{ ...S.sCard, borderLeft: '2px solid var(--red)' }}>
          <div style={S.sH}><span style={{ ...S.dot, background: 'var(--red)' }} />Bearish</div>
          <div style={S.sD}>Declining social interest</div>
          {bearish.map((t, i) => (
            <TokenRow key={t.token} t={t} i={i} sel={selToken} onClick={fetchSetup} colorFn={() => 'var(--red)'} barMax={20} absBar />
          ))}
          {bearish.length === 0 && <Empty />}
        </div>
      </div>

      {/* Trade Setup Panel */}
      {selToken && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 16, animation: 'fadeIn .2s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600, color: 'var(--text-bright)' }}>{selToken}</div>
              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1 }}>Token analysis</div>
            </div>
            <button style={S.retryBtn} onClick={() => { setSelToken(null); setSetupData(null); }}>Close</button>
          </div>

          {setupLoading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>
              <div style={S.loadText}>Analyzing {selToken}...</div>
            </div>
          ) : setupData ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10, marginBottom: 12 }}>
                <SetupPanel side="Long" setup={setupData.long} preferred={setupData.preferred === 'long'} color="var(--green)" />
                <SetupPanel side="Short" setup={setupData.short} preferred={setupData.preferred === 'short'} color="var(--red)" />
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 4, padding: 12 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 500, color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Rationale</div>
                <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{setupData.rationale}</p>
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              Could not generate analysis. Check your API key in server/.env.
            </div>
          )}
          <p style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 10 }}>Not financial advice</p>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──

function Empty() {
  return <div style={{ color: 'var(--text-dim)', fontSize: 11, padding: 8 }}>None right now</div>;
}

function TokenRow({ t, i, sel, onClick, colorFn, barMax, absBar }: {
  t: { token: string; change_percent: number; current_count: number };
  i: number; sel: string | null;
  onClick: (token: string) => void;
  colorFn: (cp: number) => string;
  barMax: number; absBar?: boolean;
}) {
  const cp = absBar ? Math.abs(t.change_percent) : Math.min(t.change_percent, barMax);
  return (
    <div
      style={{ ...S.sR, cursor: 'pointer', padding: '6px 4px', background: sel === t.token ? 'rgba(255,255,255,0.03)' : 'transparent' }}
      onClick={() => onClick(t.token)}
    >
      <span style={S.sRk}>{i + 1}</span>
      <span style={S.sTk}>{t.token}</span>
      <div style={{ flex: 1 }}>
        <div style={{ ...S.sBar, width: Math.min(100, cp / barMax * 100) + '%', background: colorFn(t.change_percent) }} />
      </div>
      <span style={{ ...S.sP, color: colorFn(t.change_percent) }}>{pct(t.change_percent)}</span>
      <span style={S.sM}>{fmt(t.current_count)}</span>
    </div>
  );
}

// ── Setup panel ──

interface SetupSide { entry: string; tp: string; sl: string; rr: string; horizon: string; conf: string }
interface ParsedSetup { long: SetupSide; short: SetupSide; preferred: string; rationale: string }

function SetupPanel({ side, setup, preferred, color }: {
  side: string; setup: SetupSide; preferred: boolean; color: string;
}) {
  const rows: [string, string][] = [
    ['Entry', setup.entry], ['TP', setup.tp], ['SL', setup.sl],
    ['R:R', setup.rr], ['Horizon', setup.horizon], ['Confidence', setup.conf],
  ];
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: preferred ? `2px solid ${color}` : '1px solid var(--border)', borderRadius: 4, padding: 12 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {side} {preferred ? '— preferred' : ''}
      </div>
      {rows.map(([l, v]) => v && v !== '—' ? (
        <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{l}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500, color: l === 'Confidence' ? color : 'var(--text-bright)' }}>{v}</span>
        </div>
      ) : null)}
    </div>
  );
}

// ── Parser ──

function parseSetup(msg: string): ParsedSetup {
  const empty: SetupSide = { entry: '—', tp: '—', sl: '—', rr: '—', horizon: '—', conf: '—' };
  const long = { ...empty };
  const short = { ...empty };

  // 1. Parse markdown table (most reliable)
  const lines = msg.split('\n');
  const tableRows = lines.filter(l => l.trim().startsWith('|') && !l.includes('---'));

  if (tableRows.length >= 3) {
    for (const row of tableRows) {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 3) continue;
      const p = cells[0].toLowerCase();
      const lv = cells[1];
      const sv = cells[2];
      if (p.includes('parameter') || p.includes('---')) continue;
      if (p.includes('entry') || p.includes('price') && !p.includes('tp') && !p.includes('sl') && !p.includes('take') && !p.includes('stop')) { long.entry = lv; short.entry = sv; }
      if (p.includes('tp') || p.includes('take profit') || p.includes('target')) { long.tp = lv; short.tp = sv; }
      if (p.includes('sl') || p.includes('stop loss')) { long.sl = lv; short.sl = sv; }
      if (p.includes('risk') || p.includes('reward') || p === 'r:r') { long.rr = lv; short.rr = sv; }
      if (p.includes('horizon') || p.includes('time')) { long.horizon = lv; short.horizon = sv; }
      if (p.includes('confidence') || p.includes('conf')) { long.conf = lv; short.conf = sv; }
    }
  }

  // 2. Fallback: **Long Setup:** / **Short Setup:** lines
  if (long.tp === '—') {
    const m = msg.match(/\*\*Long Setup\*?\*?:?\s*(.+)/i);
    if (m) parseSingleLine(m[1], long);
  }
  if (short.tp === '—') {
    const m = msg.match(/\*\*Short Setup\*?\*?:?\s*(.+)/i);
    if (m) parseSingleLine(m[1], short);
  }

  // 3. Determine preferred by confidence
  const lc = parseInt(long.conf) || 0;
  const sc = parseInt(short.conf) || 0;
  const preferred = sc > lc ? 'short' : 'long';

  // 4. Extract rationale from TL;DR
  const tldr = msg.match(/TL;?DR:?\s*\n?(.+?)(?:\n\n|\n\*\*)/s)?.[1]
    || msg.split('\n').find(l => l.length > 50 && !l.startsWith('#') && !l.startsWith('|'))
    || msg.slice(0, 300);
  const rationale = tldr.replace(/\*\*/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();

  return { long, short, preferred, rationale };
}

function parseSingleLine(line: string, side: SetupSide) {
  side.entry = line.match(/at\s+\$?([\d,.]+)/)?.[1] || '—';
  side.tp = line.match(/TP\s+\$?([\d,.]+)/)?.[1] || '—';
  side.sl = line.match(/SL\s+\$?([\d,.]+)/)?.[1] || '—';
  side.rr = line.match(/(\d+:\d+(?:\.\d+)?)/)?.[1] || '—';
  side.horizon = line.match(/([\d]+-[\d]+\s*(?:hours?|days?|h|d))/i)?.[1] || '—';
  side.conf = line.match(/(\d+%)\s*confidence/)?.[1] || '—';
}
