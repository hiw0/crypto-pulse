# ⚡ Crypto Pulse — Elfa AI Social Intelligence Dashboard

Real-time crypto social intelligence dashboard powered by [Elfa AI](https://elfa.ai). Tracks trending tokens, narratives, trade signals, AI analysis, and more — all with live data.

## Features

- **🌍 Macro Overview** — AI-generated market briefing with key stats
- **⚡ Trade Signals** — Clickable bullish/bearish tokens with on-demand AI trade setups (TP/SL/confidence)
- **📈 Trending Tokens** — Ranked by social mention volume with change %
- **📰 Events** — AI-summarized crypto events from Twitter/X
- **💬 Narratives** — Trending narrative clusters
- **🔥 Top Mentions** — Highest-engagement posts per token
- **🔍 Search** — Real-time keyword mentions search
- **🤖 Ask Elfa** — Interactive AI chat (macro, token analysis, account analysis)
- **🧠 Smart Stats** — Twitter account intelligence
- **📋 Contracts** — Trending contract addresses (Twitter + Telegram)

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite 6
- **Backend:** Express 5 + TypeScript (API proxy)
- **Styling:** Zero external UI deps — pure CSS-in-JS
- **Fonts:** JetBrains Mono + DM Sans
- **Persistence:** localStorage (active tab, chat history)

## Quick Start

### 1. Set up your API key

Get a free API key at [go.elfa.ai/claude-skills](https://go.elfa.ai/claude-skills).

```bash
# Copy the example env and add your key
cp server/.env.example server/.env
# Edit server/.env and set ELFA_API_KEY=your_key_here
```

### 2. Install dependencies

```bash
npm install
cd server && npm install && cd ..
```

### 3. Start development

```bash
npm run dev
```

This starts both:
- **Frontend** at http://localhost:3000 (Vite)
- **Backend** at http://localhost:3001 (Express)

The Vite dev server proxies `/api/*` requests to the Express backend.

### 4. Build for production

```bash
npm run build
```

## Architecture

```
crypto-pulse/
├── src/                    # React frontend (TypeScript)
│   ├── App.tsx             # Thin shell — header, nav, tab router, footer
│   ├── types/              # TypeScript interfaces
│   ├── styles/             # CSS + inline styles
│   ├── utils/              # Formatting helpers
│   ├── api/                # Typed API client
│   ├── hooks/              # useApiData, useLocalStorage, useChat
│   └── components/
│       ├── layout/         # Header, Nav, Footer
│       └── tabs/           # 10 tab components (one per feature)
└── server/                 # Express backend (TypeScript)
    └── src/
        ├── routes/         # 9 API proxy routes
        └── middleware/     # Error handler
```

### API Key Security

The Elfa API key is stored **only on the server** in `server/.env`. The frontend never sees the key — all API calls are proxied through the Express backend.

### Live Data

Each tab fetches its own data on mount and auto-refreshes every 60 seconds. Only the active tab polls, staying within the 60 RPM rate limit.

### Persistence

- **Active tab** — restored on page reload
- **Chat history** — persisted across sessions via localStorage

## Elfa API Endpoints

| Backend Route | Elfa Endpoint | Credits |
|---|---|---|
| `GET /api/trending-tokens` | `/v2/aggregations/trending-tokens` | 1 |
| `GET /api/token-news` | `/v2/data/token-news` | 1 |
| `GET /api/event-summary` | `/v2/data/event-summary` | 5 |
| `GET /api/trending-narratives` | `/v2/data/trending-narratives` | 5 |
| `GET /api/top-mentions?token=X` | `/v2/data/top-mentions` | 1 |
| `GET /api/keyword-mentions?keyword=X` | `/v2/data/keyword-mentions` | 1 |
| `GET /api/smart-stats?username=X` | `/v2/account/smart-stats` | 1 |
| `GET /api/trending-cas/:platform` | `/v2/aggregations/trending-cas/:platform` | 1 |
| `POST /api/chat` | `/v2/chat` | 9-15 |

## License

MIT — built with data from [Elfa AI](https://elfa.ai).
