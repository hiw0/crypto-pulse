import { useState, useRef, useEffect, type ReactNode } from 'react';
import { S } from '../../styles/S';
import { useChat } from '../../hooks/useChat';

export function AiChatTab() {
  const { history, loading, error, send, clearHistory } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history.length, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    send(input.trim());
    setInput('');
  };

  const quickAsk = (msg: string) => {
    send(msg);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 400 }}>
      {/* Chat History */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingRight: 4 }}>
        {history.length === 0 && !loading && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Ask Elfa anything</p>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>
                Just type naturally — mention a ticker for analysis, @ for account stats, or ask anything about the market.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              {[
                'Market summary',
                'Macro overview',
                'Analyze BTC',
                'Analyze ETH',
                'Analyze SOL',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => quickAsk(q)}
                  style={{
                    padding: '8px 16px', fontSize: 12, fontFamily: 'var(--mono)',
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 4, color: 'var(--accent)', cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 6, padding: 16, animation: 'fadeIn .3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, letterSpacing: 2, color: msg.role === 'user' ? 'var(--accent)' : 'var(--green)' }}>
                  {msg.role === 'user' ? 'YOU' : 'ELFA AI'}
                </span>
                {msg.token && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 4 }}>
                    {msg.token.toUpperCase()}
                  </span>
                )}
              </div>
              {msg.credits && <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)' }}>{msg.credits} credits</span>}
            </div>
            <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 20, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', animation: 'pulse 1.5s infinite' }}>Elfa is thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        {error && <div style={{ fontSize: 12, color: 'var(--red)', marginBottom: 8 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about any token, market, or @account..."
            style={{
              flex: 1, padding: '12px 16px', background: 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-bright)',
              fontSize: 14, fontFamily: 'var(--sans)', outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 24px',
              background: loading || !input.trim() ? 'var(--surface2)' : 'var(--accent)',
              border: 'none', borderRadius: 4, color: '#fff', fontSize: 13,
              fontWeight: 600, fontFamily: 'var(--mono)',
              cursor: loading || !input.trim() ? 'default' : 'pointer',
              opacity: loading || !input.trim() ? 0.5 : 1, transition: 'all .2s',
            }}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', fontStyle: 'italic' }}>
            Tip: "analyze BTC" · "market summary" · "macro overview" · "$SOL outlook"
          </span>
          {history.length > 0 && (
            <button onClick={clearHistory} style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
              Clear chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderMarkdown(content: string) {
  return content.split('\n').map((line, j) => {
    if (line.startsWith('# ')) return <div key={j} style={{ fontSize: 18, fontWeight: 700, marginTop: 12, marginBottom: 6, color: 'var(--text-bright)' }}>{line.slice(2)}</div>;
    if (line.startsWith('## ')) return <div key={j} style={{ fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 4, color: 'var(--text-bright)' }}>{line.slice(3)}</div>;
    if (line.startsWith('**') && line.endsWith('**')) return <div key={j} style={{ fontWeight: 700, color: 'var(--text-bright)', marginTop: 6 }}>{line.slice(2, -2)}</div>;
    if (line.startsWith('- **')) return <div key={j} style={{ paddingLeft: 12, marginTop: 2 }}><span style={{ color: 'var(--accent)' }}>•</span> <span>{renderInlineMarkdown(line.slice(2))}</span></div>;
    if (line.startsWith('- ')) return <div key={j} style={{ paddingLeft: 12, marginTop: 2 }}><span style={{ color: 'var(--text-dim)' }}>•</span> {line.slice(2)}</div>;
    if (line.startsWith('|')) return <div key={j} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', padding: '2px 0' }}>{line}</div>;
    if (line.startsWith('---')) return <hr key={j} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '12px 0' }} />;
    if (line.trim() === '') return <div key={j} style={{ height: 8 }} />;
    return <div key={j} style={{ marginTop: 2 }}>{renderInlineMarkdown(line)}</div>;
  });
}

export function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={nodes.length} style={{ color: 'var(--text-bright)' }}>
          {match[2]}
        </strong>
      );
    } else if (match[3] && match[4]) {
      const href = safeHref(match[4]);
      nodes.push(href ? (
        <a key={nodes.length} href={href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          {match[3]} ↗
        </a>
      ) : match[3]);
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

function safeHref(value: string): string | null {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
