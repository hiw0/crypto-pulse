import { S } from '../../styles/S';
import type { TabId, TabDef } from '../../types';

const TABS: TabDef[] = [
  { id: 'macro', label: 'Macro' },
  { id: 'signals', label: 'Signals' },
  { id: 'trending', label: 'Trending' },
  { id: 'events', label: 'Events' },
  { id: 'narratives', label: 'Narratives' },
  { id: 'mentions', label: 'Mentions' },
  { id: 'search', label: 'Search' },
  { id: 'aichat', label: 'Ask Elfa' },
  { id: 'smart', label: 'Smart Stats' },
  { id: 'contracts', label: 'Contracts' },
];

interface NavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Nav({ activeTab, onTabChange }: NavProps) {
  return (
    <nav style={S.nav}>
      {TABS.map(({ id, label }) => (
        <button
          key={id}
          style={{ ...S.nb, ...(activeTab === id ? S.na : {}) }}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
