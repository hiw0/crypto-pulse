export type TabId = 'macro' | 'signals' | 'trending' | 'events' | 'narratives'
  | 'mentions' | 'search' | 'aichat' | 'smart' | 'contracts';

export interface TabDef {
  id: TabId;
  label: string;
}

export type ElfaAnalysisType = 'chat' | 'macro' | 'summary' | 'tokenAnalysis' | 'tokenIntro' | 'accountAnalysis';

export interface ChatMessage {
  role: 'user' | 'elfa';
  content: string;
  type: ElfaAnalysisType;
  token?: string;
  credits?: number;
}
