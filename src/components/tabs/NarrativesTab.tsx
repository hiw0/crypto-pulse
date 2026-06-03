import { S } from '../../styles/S';
import { api } from '../../api/client';
import { useApiData } from '../../hooks/useApiData';

export function NarrativesTab() {
  const { data: narratives, loading, error, refetch } = useApiData(api.getNarratives);

  if (loading && !narratives) {
    return <div style={S.loadWrap}><div style={S.loadText}>Loading narratives...</div></div>;
  }
  if (error) {
    return <div style={S.errWrap}><div style={S.errText}>{error}</div><button style={S.retryBtn} onClick={refetch}>Retry</button></div>;
  }
  if (!narratives || narratives.length === 0) return <div style={S.loadWrap}><div style={{ color: 'var(--text-dim)' }}>No narratives</div></div>;

  return (
    <div style={S.narGrid}>
      {narratives.map((n, i) => (
        <div key={i} style={S.narCard} className="hcard">
          <div style={S.narN}>NARRATIVE #{i + 1}</div>
          <p style={S.narT}>{n.narrative}</p>
          <div style={S.narL}>
            {n.source_links.map((l, j) => (
              <a key={j} href={l} target="_blank" rel="noreferrer" style={S.nLink}>Source {j + 1} ↗</a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
