import { useState } from 'react';
import { S } from '../../styles/S';
import { fmt } from '../../utils/format';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function MentionsTab() {
  const [token, setToken] = useState('BTC');
  const [inputVal, setInputVal] = useState('BTC');
  const { data: mentions, loading, error, refetch } = useApiData(
    () => api.getTopMentions(token),
    { refreshInterval: 60000 }
  );

  const handleSearch = () => {
    if (inputVal.trim()) {
      setToken(inputVal.trim().toUpperCase());
    }
  };

  return (
    <div>
      <div style={S.secTitle}>Top Mentions (24h)</div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Token symbol (e.g. BTC, ETH)"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={{
            flex: '0 0 200px', padding: '10px 14px', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-bright)',
            fontSize: 13, fontFamily: 'var(--mono)', outline: 'none',
          }}
        />
        <button onClick={handleSearch} style={S.retryBtn}>Search</button>
        {['BTC', 'ETH', 'SOL'].map(t => (
          <button key={t} onClick={() => { setInputVal(t); setToken(t); }} style={{
            padding: '4px 12px', fontSize: 11, fontFamily: 'var(--mono)',
            background: token === t ? 'var(--surface2)' : 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: 4,
            color: 'var(--accent)', cursor: 'pointer',
          }}>
            {t}
          </button>
        ))}
      </div>

      {loading && !mentions ? (
        <div style={S.loadWrap}><div style={S.loadText}>Loading mentions...</div></div>
      ) : error ? (
        <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>
      ) : !mentions || mentions.length === 0 ? (
        <div style={S.loadWrap}><div style={{ color: 'var(--text-dim)' }}>No mentions for {token}</div></div>
      ) : (
        <div style={S.mentGrid}>
          {mentions.map((m, i) => (
            <div key={i} style={S.mentCard} className="hcard">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={S.mentAcct}>@{m.account}</span>
                {m.smart > 0 && <span style={S.smartBadge}>{m.smart} smart reposts</span>}
              </div>
              <div style={S.mentStats}>
                <span>{fmt(m.likes)} likes</span>
                <span>{fmt(m.reposts)} reposts</span>
                <span>{fmt(m.views)} views</span>
                <span>{fmt(m.bookmarks)} bookmarks</span>
              </div>
              <a href={m.link} target="_blank" rel="noreferrer" style={S.nLink}>View on X ↗</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
