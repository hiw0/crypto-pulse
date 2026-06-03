import { S } from '../../styles/S';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function ContractsTab() {
  const { data: twitter, loading: l1, error: e1, refetch: r1 } = useApiData(() => api.getTrendingCAs('twitter'));
  const { data: telegram, loading: l2, error: e2, refetch: r2 } = useApiData(() => api.getTrendingCAs('telegram'));

  const renderTable = (
    title: string,
    data: typeof twitter,
    loading: boolean,
    error: string | null,
    refetch: () => void
  ) => (
    <div style={{ marginBottom: 32 }}>
      <div style={S.secTitle}>{title}</div>
      {loading && !data ? (
        <div style={S.loadWrap}><div style={S.loadText}>Loading...</div></div>
      ) : error ? (
        <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>
      ) : !data || data.length === 0 ? (
        <div style={{ color: 'var(--text-dim)', padding: 20 }}>No data</div>
      ) : (
        <table style={S.tbl}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: 36 }}>#</th>
              <th style={S.th}>Contract Address</th>
              <th style={{ ...S.th, textAlign: 'center' }}>Chain</th>
              <th style={{ ...S.th, textAlign: 'right' }}>Mentions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr key={i} className="trow">
                <td style={{ ...S.td, fontFamily: 'var(--mono)', color: 'var(--text-dim)' }}>{i + 1}</td>
                <td style={{ ...S.td, fontFamily: 'var(--mono)', fontSize: 11 }}>
                  {c.ca.slice(0, 8)}…{c.ca.slice(-8)}{' '}
                  <button style={S.cpBtn} onClick={() => navigator.clipboard?.writeText(c.ca)}>Copy</button>
                </td>
                <td style={{ ...S.td, textAlign: 'center' }}>
                  <span style={{
                    ...S.chBdg,
                    background: c.chain === 'solana' ? 'rgba(153,69,255,0.12)' : 'rgba(98,126,234,0.12)',
                    color: c.chain === 'solana' ? '#9945FF' : '#627EEA',
                  }}>
                    {c.chain}
                  </span>
                </td>
                <td style={{ ...S.td, textAlign: 'right', fontFamily: 'var(--mono)', fontWeight: 700 }}>{c.mentions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      {renderTable('Trending CAs — Twitter', twitter, l1, e1, r1)}
      {renderTable('Trending CAs — Telegram', telegram, l2, e2, r2)}
    </div>
  );
}
