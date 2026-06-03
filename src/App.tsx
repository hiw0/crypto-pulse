import { useState, useCallback } from 'react';
import { CSS } from './styles/css';
import { S } from './styles/S';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { MacroTab } from './components/tabs/MacroTab';
import { SignalsTab } from './components/tabs/SignalsTab';
import { TrendingTab } from './components/tabs/TrendingTab';
import { EventsTab } from './components/tabs/EventsTab';
import { NarrativesTab } from './components/tabs/NarrativesTab';
import { MentionsTab } from './components/tabs/MentionsTab';
import { SearchTab } from './components/tabs/SearchTab';
import { AiChatTab } from './components/tabs/AiChatTab';
import { SmartStatsTab } from './components/tabs/SmartStatsTab';
import { ContractsTab } from './components/tabs/ContractsTab';
import type { TabId, MacroData } from './types';

export default function App() {
  const [tab, setTab] = useLocalStorage<TabId>('cp-active-tab', 'macro');
  const [macro, setMacro] = useState<MacroData | null>(null);

  const handleMacroData = useCallback((data: MacroData | null) => {
    setMacro(data);
  }, []);

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      <Header macro={macro} />
      <Nav activeTab={tab} onTabChange={setTab} />
      <main style={S.main}>
        {tab === 'macro' && <MacroTab onMacroData={handleMacroData} />}
        {tab === 'signals' && <SignalsTab />}
        {tab === 'trending' && <TrendingTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'narratives' && <NarrativesTab />}
        {tab === 'mentions' && <MentionsTab />}
        {tab === 'search' && <SearchTab />}
        {tab === 'aichat' && <AiChatTab />}
        {tab === 'smart' && <SmartStatsTab />}
        {tab === 'contracts' && <ContractsTab />}
      </main>
      <Footer />
    </div>
  );
}
