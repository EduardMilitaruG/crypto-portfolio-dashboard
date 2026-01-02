import { fetchPrices, getSupportedSymbols, isSupportedCrypto } from '../services/coinGeckoService.js';
import db from '../models/database.js';

// Get live prices for specified symbols
export const getPrices = async (req, res) => {
  try {
    const { symbols } = req.query;

    if (!symbols) {
      return res.status(400).json({ error: 'symbols query parameter is required (e.g., ?symbols=btc,eth,sol)' });
    }

    const result = await fetchPrices(symbols);
    res.json(result);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};

// Get prices for all crypto assets in portfolio
export const getPortfolioPrices = async (req, res) => {
  try {
    // Get all crypto assets from database
    const cryptoAssets = db.prepare(`
      SELECT DISTINCT symbol FROM assets WHERE assetType = 'crypto'
    `).all();

    if (cryptoAssets.length === 0) {
      return res.json({ prices: {}, message: 'No crypto assets in portfolio' });
    }

    const symbols = cryptoAssets.map(a => a.symbol).join(',');
    const result = await fetchPrices(symbols);

    // Update prices in database
    if (Object.keys(result.prices).length > 0) {
      const updateStmt = db.prepare(`
        UPDATE assets SET currentPrice = ? WHERE symbol = ? AND assetType = 'crypto'
      `);

      const updateMany = db.transaction((priceMap) => {
        for (const [symbol, price] of Object.entries(priceMap)) {
          updateStmt.run(price, symbol);
        }
      });

      updateMany(result.prices);
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching portfolio prices:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio prices' });
  }
};

// Get list of supported crypto symbols
export const getSupportedCryptos = (req, res) => {
  res.json({ symbols: getSupportedSymbols() });
};

// Check if a symbol is supported
export const checkSymbol = (req, res) => {
  const { symbol } = req.params;
  res.json({
    symbol: symbol.toUpperCase(),
    supported: isSupportedCrypto(symbol)
  });
};
