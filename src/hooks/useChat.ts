import { useState, useCallback } from 'react';
import { api } from '../api/client';
import { useLocalStorage } from './useLocalStorage';
import type { ChatMessage, ChatRequest, ElfaAnalysisType } from '../types';

// Common tickers to detect in messages
const KNOWN_TICKERS = [
  'BTC','ETH','SOL','XRP','ADA','DOGE','AVAX','DOT','MATIC','LINK',
  'UNI','AAVE','LTC','BCH','ATOM','FIL','APT','SUI','ARB','OP',
  'TIA','SEI','INJ','NEAR','FTM','HYPE','TAO','ZEC','PEPE','WIF',
  'BONK','JUP','RENDER','STX','MKR','CRV','PENDLE','ENA','ONDO',
  'STRC','CLAWD','SERV','TSLA','AAPL','NVDA','SPY','SPX','QQQ',
];

function detectIntent(message: string): { type: ElfaAnalysisType; symbol: string } {
  const upper = message.toUpperCase();
  const words = upper.split(/\s+/);

  // Check for @username → account analysis
  const atMatch = message.match(/@(\w{2,30})/);
  if (atMatch) {
    return { type: 'accountAnalysis', symbol: atMatch[1] };
  }

  // Check for explicit macro/summary keywords
  const macroPatterns = /\b(macro|market overview|market brief|big picture)\b/i;
  const summaryPatterns = /\b(market summary|daily summary|summarize|recap)\b/i;
  if (macroPatterns.test(message)) return { type: 'macro', symbol: '' };
  if (summaryPatterns.test(message)) return { type: 'summary', symbol: '' };

  // Check for token analysis intent with a known ticker
  const analysisPatterns = /\b(analy[sz]e|breakdown|setup|trade|outlook|prediction|forecast|ta\b|technical)\b/i;
  const introPatterns = /\b(what is|explain|intro|about|overview of|tell me about)\b/i;

  // Find tickers mentioned in the message
  const foundTickers = KNOWN_TICKERS.filter(t => words.includes(t) || words.includes('$' + t));

  if (foundTickers.length > 0) {
    const ticker = foundTickers[0];
    if (introPatterns.test(message)) return { type: 'tokenIntro', symbol: ticker };
    if (analysisPatterns.test(message)) return { type: 'tokenAnalysis', symbol: ticker };
    // Default: if a ticker is mentioned, do token analysis
    return { type: 'tokenAnalysis', symbol: ticker };
  }

  // Also detect $TICKER pattern for any ticker
  const dollarMatch = message.match(/\$([A-Za-z]{2,10})/);
  if (dollarMatch) {
    const ticker = dollarMatch[1].toUpperCase();
    if (introPatterns.test(message)) return { type: 'tokenIntro', symbol: ticker };
    return { type: 'tokenAnalysis', symbol: ticker };
  }

  // Default: general chat
  return { type: 'chat', symbol: '' };
}

export function useChat() {
  const [history, setHistory] = useLocalStorage<ChatMessage[]>('cp-chat-history', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const send = useCallback(async (message: string) => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    const { type, symbol } = detectIntent(message);

    const userMsg: ChatMessage = {
      role: 'user',
      content: message,
      type,
      token: symbol || undefined,
    };
    setHistory(h => [...h, userMsg]);

    try {
      const body: ChatRequest = { analysisType: type, speed: 'fast' };

      if (type === 'chat') {
        body.message = message;
      } else if (['macro', 'summary'].includes(type)) {
        body.message = message;
      } else if (['tokenAnalysis', 'tokenIntro'].includes(type)) {
        body.assetMetadata = { symbol: symbol.toUpperCase() };
      } else if (type === 'accountAnalysis') {
        body.assetMetadata = { username: symbol };
      }

      if (sessionId) body.sessionId = sessionId;

      const res = await api.chat(body);
      const msg = res?.data?.message || 'No response';
      if (res?.data?.sessionId) setSessionId(res.data.sessionId);

      setHistory(h => [...h, {
        role: 'elfa',
        content: msg,
        type,
        token: symbol || undefined,
        credits: res?.data?.creditsConsumed,
      }]);
    } catch (err) {
      setError('API call failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setHistory(h => h.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [sessionId, setHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setSessionId(null);
  }, [setHistory]);

  return { history, loading, error, send, clearHistory };
}
