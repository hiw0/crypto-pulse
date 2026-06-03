import { useState } from 'react';
import { S } from '../../styles/S';
import { fmt } from '../../utils/format';
import { api } from '../../api/client';
import type { SmartStat } from '../../types';

export function SmartStatsTab() {
  const [username, setUsername] = useState('');
  const [stats, setStats] = useState<SmartStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (user?: string) => {
    const name = user || username.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSmartStats(name);
      const arr = Array.isArray(data) ? data : [data];
      // Add only if not already present
      setStats(prev => {
        const existing = prev.map(s => s.username);
        const newStats = arr.filter(s => !existing.includes(s.username));
        return [...prev, ...newStats];
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={S.secTitle}>Smart Account Stats</div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          placeholder="Twitter username (e.g. RaoulGMI)"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && lookup()}
          style={{
            flex: '0 0 260px', padding: '10px 14px', background: 'var(--surface2)',
            border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-bright)',
            fontSize: 13, fontFamily: 'var(--mono)', outline: 'none',
          }}
        />
        <button onClick={() => lookup()} disabled={loading} style={{
          ...S.retryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer',
        }}>
          {loading ? 'Looking up...' : 'Lookup'}
        </button>
        {['RaoulGMI', '100trillionUSD', 'CryptoHayes'].map(u => (
          <button key={u} onClick={() => { setUsername(u); lookup(u); }} style={{
            padding: '4px 12px', fontSize: 11, fontFamily: 'var(--mono)',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--accent)', cursor: 'pointer',
          }}>
            @{u}
          </button>
        ))}
      </div>

      {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 16 }}>{error}</div>}

      {stats.length > 0 ? (
        <div style={S.smartGrid}>
          {stats.map((s, i) => (
            <div key={i} style={S.smartCard}>
              <div style={S.smartUser}>@{s.username}</div>
              <div style={S.smartRow}><span style={S.smartLabel}>Followers</span><span style={S.smartVal}>{fmt(s.followers)}</span></div>
              <div style={S.smartRow}><span style={S.smartLabel}>Smart Followers</span><span style={{ ...S.smartVal, color: 'var(--accent)' }}>{s.smartFollowers}</span></div>
              <div style={S.smartRow}><span style={S.smartLabel}>Smart Following</span><span style={S.smartVal}>{s.smartFollowing}</span></div>
              <div style={S.smartRow}><span style={S.smartLabel}>Avg Reach</span><span style={S.smartVal}>{fmt(s.avgReach)}</span></div>
              <div style={S.smartRow}><span style={S.smartLabel}>Avg Engagement</span><span style={S.smartVal}>{s.avgEngagement.toFixed(2)}%</span></div>
            </div>
          ))}
        </div>
      ) : !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
          <p style={{ fontSize: 14 }}>Look up any Twitter account to see smart follower analytics</p>
        </div>
      )}
    </div>
  );
}
