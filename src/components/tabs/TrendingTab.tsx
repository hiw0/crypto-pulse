import { S } from '../../styles/S';
import { fmt, pct, sCol, sLbl } from '../../utils/format';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function TrendingTab() {
  const { data: tokens, loading, error, refetch } = useApiData(api.getTrendingTokens);

  if (loading && !tokens) {
    return <div style={S.loadWrap}><div style={S.loadText}>Loading trending tokens...</div></div>;
  }
  if (error) {
    return <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>;
  }
  if (!tokens || tokens.length === 0) return <div style={S.loadWrap}><div style={{ color: 'var(--text-dim)' }}>No trending data</div></div>;

  const maxM = Math.max(...tokens.map(t => t.current_count));

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={S.tbl}>
        <thead>
          <tr>
            <th style={{ ...S.th, width: 36 }}>#</th>
            <th style={S.th}>Token</th>
            <th style={{ ...S.th, textAlign: 'right' }}>Now</th>
            <th style={{ ...S.th, width: '20%' }}>Volume</th>
            <th style={{ ...S.th, textAlign: 'right' }}>Prev</th>
            <th style={{ ...S.th, textAlign: 'right' }}>&Delta;</th>
            <th style={{ ...S.th, textAlign: 'center' }}>Signal</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={t.token} className="trow">
              <td style={{ ...S.td, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>{i + 1}</td>
              <td style={S.td}><b style={{ fontFamily: 'var(--mono)' }}>{t.token}</b></td>
              <td style={{ ...S.td, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 600 }}>{fmt(t.current_count)}</td>
              <td style={S.td}>
                <div style={S.bT}>
                  <div style={{ ...S.bF, width: (t.current_count / maxM * 100) + '%', background: sCol(t.change_percent) }} />
                </div>
              </td>
              <td style={{ ...S.td, textAlign: 'right', fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>{fmt(t.previous_count)}</td>
              <td style={{ ...S.td, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700, color: sCol(t.change_percent) }}>{pct(t.change_percent)}</td>
              <td style={{ ...S.td, textAlign: 'center', fontSize: 11, fontWeight: 600, color: sCol(t.change_percent) }}>{sLbl(t.change_percent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
