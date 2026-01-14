# Crypto Portfolio Dashboard

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

A full-stack investment portfolio dashboard for tracking cryptocurrencies, stocks, and ETFs with real-time price updates via the CoinGecko API. Built with TypeScript on both frontend and backend for complete type safety.

## Key Features

- **Portfolio Management** - Full CRUD operations for managing investment assets
- **Live Crypto Prices** - Real-time price updates from CoinGecko API with intelligent caching
- **Multi-Asset Support** - Track cryptocurrencies, stocks, and ETFs in one place
- **Interactive Charts** - Visual portfolio allocation and performance analytics
- **Profit/Loss Tracking** - Real-time P/L calculations with color-coded indicators
- **Responsive Design** - Dark theme UI optimized for all screen sizes
- **Type Safety** - Full TypeScript implementation across the stack

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Recharts | Data visualization |
| Axios | API communication |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| TypeScript + tsx | Type-safe development |
| SQLite + better-sqlite3 | Data persistence |
| CoinGecko API | Live crypto prices |

## Project Architecture

```
crypto-portfolio-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── AssetForm.tsx
│   │   │   ├── AssetTable.tsx
│   │   │   ├── DeleteConfirm.tsx
│   │   │   ├── PortfolioCharts.tsx
│   │   │   └── PortfolioSummary.tsx
│   │   ├── services/          # API services
│   │   │   ├── api.ts
│   │   │   └── priceService.ts
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   │   ├── assetController.ts
│   │   │   └── priceController.ts
│   │   ├── models/            # Database models
│   │   │   └── database.ts
│   │   ├── routes/            # API routes
│   │   │   ├── assetRoutes.ts
│   │   │   └── priceRoutes.ts
│   │   ├── services/          # Business logic
│   │   │   └── coinGeckoService.ts
│   │   ├── types/             # TypeScript types
│   │   ├── server.ts
│   │   └── seed.ts
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/EduardMilitaruG/crypto-portfolio-dashboard.git
cd crypto-portfolio-dashboard

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Seed the database (optional)
cd server && npm run seed
```

### Running the Application

```bash
# Terminal 1: Start backend server
cd server && npm run dev
# Server runs on http://localhost:3001

# Terminal 2: Start frontend
cd client && npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| GET | `/api/assets/:id` | Get single asset |
| POST | `/api/assets` | Create new asset |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |

### Prices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/prices?symbols=btc,eth` | Get prices for symbols |
| GET | `/api/prices/portfolio` | Get prices for all portfolio crypto |
| GET | `/api/prices/supported` | List supported crypto symbols |
| GET | `/api/prices/check/:symbol` | Check if symbol is supported |

## CoinGecko Integration

The application maps common crypto symbols to CoinGecko IDs:

| Symbol | CoinGecko ID |
|--------|--------------|
| BTC | bitcoin |
| ETH | ethereum |
| SOL | solana |
| ADA | cardano |
| ... | (50+ supported) |

**Features:**
- 5-minute price caching to respect API rate limits
- Automatic retry with cached data on rate limit
- Graceful error handling for API failures

## Database Schema

```sql
CREATE TABLE assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  assetName TEXT NOT NULL,
  symbol TEXT NOT NULL,
  assetType TEXT CHECK(assetType IN ('crypto', 'stock', 'etf')),
  quantity REAL NOT NULL,
  buyPrice REAL NOT NULL,
  currentPrice REAL DEFAULT 0,
  notes TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);
```

## Skills Demonstrated

- Full-stack TypeScript development
- RESTful API design and implementation
- React component architecture with hooks
- Database design and SQL operations
- Third-party API integration with caching
- Error handling and graceful degradation
- Data visualization with Recharts
- Modern build tooling (Vite)

## Author

**Eduard Militaru**
- GitHub: [@EduardMilitaruG](https://github.com/EduardMilitaruG)
- LinkedIn: [Eduard Militaru](https://linkedin.com/in/eduardmilitaru)

## License

MIT License

---

*Built as a portfolio project demonstrating full-stack TypeScript development*
