import { S } from '../../styles/S';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';
import type { MacroData } from '../../types';

interface MacroTabProps {
  onMacroData?: (data: MacroData | null) => void;
}

export function MacroTab({ onMacroData }: MacroTabProps) {
  const { data: chatRes, loading, error, refetch } = useApiData(
    async () => {
      const res = await api.chat({ analysisType: 'macro', speed: 'fast' });
      return res;
    },
    { refreshInterval: 120000 }
  );

  const message = chatRes?.data?.message || '';

  // Parse the macro briefing from the AI response
  // The chat response is free-text, so we display it as a briefing
  const macro = parseMacroBrief(message);

  // Notify parent of macro data for header price pills
  if (onMacroData && macro) {
    onMacroData(macro);
  }

  if (loading && !chatRes) {
    return (
      <div style={S.loadWrap}>
        <div style={S.loadText}>Loading macro briefing...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.errWrap}>
        <div style={S.errText}>{error}</div>
        <button style={S.retryBtn} onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      {macro && (
        <div style={S.statGrid}>
          {([
            ['Market Cap', macro.marketCap, macro.marketCapChange, true],
            ['24h Volume', macro.volume24h, macro.volumeChange, true],
            ['BTC Dominance', macro.btcDom, null, false],
            ['BTC Price', macro.btcPrice, macro.btcChange, false],
            ['ETH Price', macro.ethPrice, macro.ethChange, false],
            ['SOL Price', macro.solPrice, macro.solChange, false],
          ] as const).map(([label, val, change, big], i) => (
            <div key={i} style={{ ...S.statCard, ...(big ? { gridColumn: 'span 2' } : {}) }}>
              <div style={S.statLabel}>{label}</div>
              <div style={S.statVal}>{val || '—'}</div>
              {change && (
                <div style={{ ...S.statChg, color: change.startsWith('-') ? 'var(--red)' : 'var(--green)' }}>
                  {change}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={S.macroBox}>
        <div style={S.macroHead}>Macro Brief</div>
        <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
          {message || 'No macro data available.'}
        </div>
      </div>
    </div>
  );
}

function parseMacroBrief(message: string): MacroData | null {
  if (!message) return null;

  const extract = (patterns: RegExp[]): string => {
    for (const p of patterns) {
      const m = message.match(p);
      if (m) return m[1];
    }
    return '';
  };

  return {
    marketCap: extract([/market\s*cap[:\s]*\$?([\d.,]+[TBMK]?)/i]) || '—',
    marketCapChange: extract([/market\s*cap.*?([+-][\d.]+%)/i]) || '',
    volume24h: extract([/(?:24h\s*)?volume[:\s]*\$?([\d.,]+[TBMK]?)/i]) || '—',
    volumeChange: extract([/volume.*?([+-][\d.]+%)/i]) || '',
    btcDom: extract([/btc\s*(?:dominance|dom)[:\s]*([\d.]+%)/i]) || '—',
    ethDom: extract([/eth\s*(?:dominance|dom)[:\s]*([\d.]+%)/i]) || '',
    btcPrice: extract([/btc.*?\$?([\d,]+(?:\.\d+)?)/i, /bitcoin.*?\$?([\d,]+)/i]) || '—',
    btcChange: extract([/btc.*?([+-][\d.]+%)/i]) || '',
    ethPrice: extract([/eth(?:ereum)?.*?\$?([\d,]+(?:\.\d+)?)/i]) || '—',
    ethChange: extract([/eth.*?([+-][\d.]+%)/i]) || '',
    solPrice: extract([/sol(?:ana)?.*?\$?([\d,]+(?:\.\d+)?)/i]) || '—',
    solChange: extract([/sol.*?([+-][\d.]+%)/i]) || '',
    vix: extract([/vix[:\s]*([\d.]+)/i]) || '',
    vixChange: extract([/vix.*?([+-][\d.]+%)/i]) || '',
    sp500: extract([/s&?p\s*500[:\s]*([\d,]+)/i]) || '',
    nasdaq: extract([/nasdaq[:\s]*([\d,]+)/i]) || '',
    yields10y: extract([/10[yY]\s*(?:yield|treasury)[:\s]*([\d.]+%?)/i]) || '',
    dollarIndex: extract([/dollar\s*index.*?([+-][\d.]+%?)/i]) || '',
    keyEvent: extract([/(?:key\s*event|catalyst)[:\s]*(.+?)(?:\n|$)/i]) || '',
    keyEvent2: '',
    etfFlows: extract([/etf\s*flows?[:\s]*(.+?)(?:\n|$)/i]) || '',
    summary: message,
  };
}
