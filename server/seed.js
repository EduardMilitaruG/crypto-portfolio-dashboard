// Seed script to populate database with sample assets
import db from './models/database.js';

const sampleAssets = [
  // Crypto assets - prices will be updated via CoinGecko
  {
    assetName: 'Bitcoin',
    symbol: 'BTC',
    assetType: 'crypto',
    quantity: 0.5,
    buyPrice: 42000,
    currentPrice: 42000,
    notes: 'Long-term hold'
  },
  {
    assetName: 'Ethereum',
    symbol: 'ETH',
    assetType: 'crypto',
    quantity: 2.5,
    buyPrice: 2200,
    currentPrice: 2200,
    notes: 'DeFi participation'
  },
  {
    assetName: 'Solana',
    symbol: 'SOL',
    assetType: 'crypto',
    quantity: 25,
    buyPrice: 95,
    currentPrice: 95,
    notes: 'High performance blockchain'
  },
  {
    assetName: 'Cardano',
    symbol: 'ADA',
    assetType: 'crypto',
    quantity: 1000,
    buyPrice: 0.45,
    currentPrice: 0.45,
    notes: 'Staking rewards'
  },
  {
    assetName: 'Chainlink',
    symbol: 'LINK',
    assetType: 'crypto',
    quantity: 50,
    buyPrice: 14.50,
    currentPrice: 14.50,
    notes: 'Oracle network investment'
  },
  // Stock assets - manual price updates
  {
    assetName: 'Apple Inc.',
    symbol: 'AAPL',
    assetType: 'stock',
    quantity: 10,
    buyPrice: 175.50,
    currentPrice: 182.00,
    notes: 'Tech blue chip'
  },
  {
    assetName: 'Microsoft Corporation',
    symbol: 'MSFT',
    assetType: 'stock',
    quantity: 5,
    buyPrice: 380.00,
    currentPrice: 405.00,
    notes: 'Cloud and AI leader'
  },
  {
    assetName: 'NVIDIA Corporation',
    symbol: 'NVDA',
    assetType: 'stock',
    quantity: 8,
    buyPrice: 450.00,
    currentPrice: 520.00,
    notes: 'AI hardware'
  },
  // ETF assets - manual price updates
  {
    assetName: 'Vanguard S&P 500 ETF',
    symbol: 'VOO',
    assetType: 'etf',
    quantity: 15,
    buyPrice: 420.00,
    currentPrice: 435.00,
    notes: 'Core portfolio holding'
  },
  {
    assetName: 'Invesco QQQ Trust',
    symbol: 'QQQ',
    assetType: 'etf',
    quantity: 8,
    buyPrice: 380.00,
    currentPrice: 410.00,
    notes: 'Nasdaq 100 exposure'
  }
];

// Clear existing data
db.prepare('DELETE FROM assets').run();

// Insert sample assets
const insertStmt = db.prepare(`
  INSERT INTO assets (assetName, symbol, assetType, quantity, buyPrice, currentPrice, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertMany = db.transaction((assets) => {
  for (const asset of assets) {
    insertStmt.run(
      asset.assetName,
      asset.symbol,
      asset.assetType,
      asset.quantity,
      asset.buyPrice,
      asset.currentPrice,
      asset.notes
    );
  }
});

insertMany(sampleAssets);

console.log(`Seeded ${sampleAssets.length} sample assets:`);
console.log(`- ${sampleAssets.filter(a => a.assetType === 'crypto').length} crypto assets`);
console.log(`- ${sampleAssets.filter(a => a.assetType === 'stock').length} stock assets`);
console.log(`- ${sampleAssets.filter(a => a.assetType === 'etf').length} ETF assets`);
