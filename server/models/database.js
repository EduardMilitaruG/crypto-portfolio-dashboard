import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'portfolio.db');

const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create assets table
// Schema explanation:
// - id: Auto-incrementing primary key
// - assetName: Human-readable name (e.g., "Bitcoin", "Apple Inc.")
// - symbol: Ticker symbol (e.g., "BTC", "AAPL")
// - assetType: Category - 'crypto', 'stock', or 'etf'
// - quantity: Number of units owned (supports decimals for crypto)
// - buyPrice: Average purchase price per unit in USD
// - currentPrice: Latest known price (updated via API for crypto, manually for others)
// - notes: Optional user notes
// - createdAt: Timestamp of when the asset was added
db.exec(`
  CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assetName TEXT NOT NULL,
    symbol TEXT NOT NULL,
    assetType TEXT NOT NULL CHECK(assetType IN ('crypto', 'stock', 'etf')),
    quantity REAL NOT NULL CHECK(quantity > 0),
    buyPrice REAL NOT NULL CHECK(buyPrice >= 0),
    currentPrice REAL DEFAULT 0,
    notes TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

export default db;
