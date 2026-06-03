export interface MacroData {
  marketCap: string;
  marketCapChange: string;
  volume24h: string;
  volumeChange: string;
  btcDom: string;
  ethDom: string;
  btcPrice: string;
  btcChange: string;
  ethPrice: string;
  ethChange: string;
  solPrice: string;
  solChange: string;
  vix: string;
  vixChange: string;
  sp500: string;
  nasdaq: string;
  yields10y: string;
  dollarIndex: string;
  keyEvent: string;
  keyEvent2: string;
  etfFlows: string;
  summary: string;
}

export interface EventItem {
  summary: string;
  link: string;
  tag: string;
}

export interface TrendingToken {
  token: string;
  current_count: number;
  previous_count: number;
  change_percent: number;
}

export interface Narrative {
  narrative: string;
  source_links: string[];
}

export interface TopMention {
  account: string;
  link: string;
  likes: number;
  reposts: number;
  views: number;
  smart: number;
  bookmarks: number;
}

export interface SmartStat {
  username: string;
  followers: number;
  smartFollowers: number;
  smartFollowing: number;
  avgReach: number;
  avgEngagement: number;
}

export interface TrendingCA {
  ca: string;
  chain: string;
  mentions: number;
}

export interface TradeSetupSide {
  tp: string;
  sl: string;
  rr: string;
  horizon: string;
  conf: number;
}

export interface TradeSetup {
  price: string;
  change: string;
  preferred: 'long' | 'short';
  long: TradeSetupSide;
  short: TradeSetupSide;
  rationale: string;
}

export interface KeywordMention {
  account: string;
  link: string;
  time: string;
  likes: number;
  views: number;
}

export interface KeywordMentionResult {
  total: number;
  results: KeywordMention[];
}

export interface ChatRequest {
  analysisType: string;
  speed: string;
  message?: string;
  assetMetadata?: { symbol?: string; username?: string };
  sessionId?: string;
}

export interface ChatResponse {
  data: {
    message: string;
    sessionId?: string;
    creditsConsumed?: number;
  };
}
