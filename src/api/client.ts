import type {
  TrendingToken,
  EventItem,
  Narrative,
  TopMention,
  SmartStat,
  TrendingCA,
  KeywordMentionResult,
  ChatRequest,
  ChatResponse,
} from '../types';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getTrendingTokens: () => fetchJson<TrendingToken[]>('/trending-tokens'),
  getEventSummary: () => fetchJson<EventItem[]>('/event-summary'),
  getNarratives: () => fetchJson<Narrative[]>('/trending-narratives'),
  getTopMentions: (token: string) => fetchJson<TopMention[]>(`/top-mentions?token=${encodeURIComponent(token)}`),
  getKeywordMentions: (keyword: string) => fetchJson<KeywordMentionResult>(`/keyword-mentions?keyword=${encodeURIComponent(keyword)}`),
  getSmartStats: (username: string) => fetchJson<SmartStat[]>(`/smart-stats?username=${encodeURIComponent(username)}`),
  getTrendingCAs: (platform: 'twitter' | 'telegram') => fetchJson<TrendingCA[]>(`/trending-cas/${platform}`),
  getTokenNews: () => fetchJson<EventItem[]>('/token-news'),
  chat: (body: ChatRequest) => fetchJson<ChatResponse>('/chat', { method: 'POST', body: JSON.stringify(body) }),
};
