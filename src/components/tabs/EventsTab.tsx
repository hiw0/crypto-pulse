import { S } from '../../styles/S';
import { tagColors } from '../../utils/format';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function EventsTab() {
  const { data: events, loading, error, refetch } = useApiData(api.getEventSummary);

  if (loading && !events) {
    return <div style={S.loadWrap}><div style={S.loadText}>Loading events...</div></div>;
  }
  if (error) {
    return <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>;
  }
  if (!events || events.length === 0) return <div style={S.loadWrap}><div style={{ color: 'var(--text-dim)' }}>No events</div></div>;

  return (
    <div style={S.evGrid}>
      {events.map((e, i) => (
        <div key={i} style={S.evCard} className="hcard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{
              ...S.evTag,
              background: ((tagColors[e.tag] || 'var(--accent)') + '18'),
              color: tagColors[e.tag] || 'var(--accent)',
            }}>
              {e.tag}
            </span>
          </div>
          <p style={S.evText}>{e.summary}</p>
          <a href={e.link} target="_blank" rel="noreferrer" style={S.evLink}>Source ↗</a>
        </div>
      ))}
    </div>
  );
}
