# Crypto Pulse — Elfa AI Social Intelligence Dashboard

Real-time crypto social intelligence dashboard powered by Elfa AI. Tracks trending tokens, narratives, social mentions, event summaries, account intelligence, and market-related discussion data.

## Features

- Macro overview with generated market briefings
- Trending tokens ranked by social mention volume
- Event summaries from crypto-related social data
- Narrative clusters for tracking market themes
- Top mentions by token
- Keyword search across social mentions
- Ask Elfa chat interface
- Smart stats for Twitter/X account intelligence
- Trending contract addresses from Twitter and Telegram

## Tech Stack

- Frontend: React 18 + TypeScript + Vite 6
- Backend: Express 5 + TypeScript API proxy
- Styling: CSS-in-JS with no external UI dependency
- Persistence: localStorage for active tab and chat history

## Quick Start

### 1. Set up your API key

Set `ELFA_API_KEY` in `server/.env`.

```bash
cp server/.env.example server/.env
# edit server/.env and set ELFA_API_KEY=your_key_here
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

- Frontend at http://localhost:3000
- Backend at http://localhost:3001

The Vite dev server proxies `/api/*` requests to the Express backend.

### 4. Build for production

```bash
npm run build
```

## Architecture

```text
crypto-pulse/
├── src/                    # React frontend
│   ├── App.tsx             # Header, nav, tab router, footer
│   ├── types/              # TypeScript interfaces
│   ├── styles/             # Styles
│   ├── utils/              # Formatting helpers
│   ├── api/                # Typed API client
│   ├── hooks/              # useApiData, useLocalStorage, useChat
│   └── components/
│       ├── layout/
│       └── tabs/
└── server/                 # Express backend
    └── src/
        ├── routes/         # API proxy routes
        └── middleware/     # Error handler
```

## API Key Security

The Elfa API key is stored only on the server in `server/.env`. The frontend never receives the key; browser requests go through the Express backend.

## Live Data

Each tab fetches its own data on mount and auto-refreshes every 60 seconds. Only the active tab polls, which helps stay within API rate limits.

## Persistence

- Active tab is restored on page reload
- Chat history is persisted locally via localStorage

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

MIT — built with data from Elfa AI.
