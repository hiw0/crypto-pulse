import { useState } from 'react';
import { S } from '../../styles/S';
import { fmt } from '../../utils/format';
import { api } from '../../api/client';
import type { KeywordMentionResult } from '../../types';

export function SearchTab() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Record<string, KeywordMentionResult>>({});
  const [activeKw, setActiveKw] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (kw?: string) => {
    const term = kw || keyword.trim();
    if (!term) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getKeywordMentions(term);
      setResults(prev => ({ ...prev, [term]: data }));
      setActiveKw(term);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const keywords = Object.keys(results);

  return (
    <div>
      <div style={S.secTitle}>Keyword Mentions Search</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Search keyword (e.g. ceasefire, ETF, halving)"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{
            flex: 1, minWidth: 200, padding: '10px 14px', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-bright)',
            fontSize: 13, fontFamily: 'var(--mono)', outline: 'none',
          }}
        />
        <button onClick={() => search()} disabled={loading} style={{
          ...S.retryBtn,
          opacity: loading ? 0.6 : 1,
          cursor: loading ? 'wait' : 'pointer',
        }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 16 }}>{error}</div>}

      {keywords.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {keywords.map(kw => (
            <button
              key={kw}
              style={{
                ...S.nb,
                ...(activeKw === kw ? { ...S.na, borderRadius: 4, background: 'var(--surface2)', borderBottom: 'none' } : { borderRadius: 4, border: '1px solid var(--border)' }),
                padding: '8px 16px',
              }}
              onClick={() => setActiveKw(kw)}
            >
              "{kw}" <span style={{ color: 'var(--text-dim)', marginLeft: 6, fontSize: 11 }}>({fmt(results[kw].total)} total)</span>
            </button>
          ))}
        </div>
      )}

      {activeKw && results[activeKw] && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 20 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
            "{activeKw.toUpperCase()}" — {fmt(results[activeKw].total)} MENTIONS IN 24H
          </div>
          {results[activeKw].results.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)', width: 20 }}>{i + 1}</span>
                <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--accent)' }}>@{r.account}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)' }}>{r.time} UTC</span>
                {r.likes > 0 && <span style={{ fontSize: 12 }}>{r.likes} likes</span>}
                <a href={r.link} target="_blank" rel="noreferrer" style={S.nLink}>View ↗</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {keywords.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
          <p style={{ fontSize: 14, marginBottom: 8 }}>Search for any keyword to see real-time mentions from X/Twitter</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['ceasefire', 'ETF', 'halving', 'airdrop'].map(kw => (
              <button key={kw} onClick={() => { setKeyword(kw); search(kw); }} style={{
                padding: '4px 12px', fontSize: 11, fontFamily: 'var(--mono)',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--accent)', cursor: 'pointer',
              }}>
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
