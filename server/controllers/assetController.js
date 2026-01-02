import db from '../models/database.js';

// Get all assets
export const getAllAssets = (req, res) => {
  try {
    const assets = db.prepare('SELECT * FROM assets ORDER BY createdAt DESC').all();
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

// Get single asset by ID
export const getAssetById = (req, res) => {
  try {
    const { id } = req.params;
    const asset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
};

// Create new asset
export const createAsset = (req, res) => {
  try {
    const { assetName, symbol, assetType, quantity, buyPrice, currentPrice, notes } = req.body;

    // Validation
    if (!assetName || !symbol || !assetType || !quantity || buyPrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields: assetName, symbol, assetType, quantity, buyPrice' });
    }

    if (!['crypto', 'stock', 'etf'].includes(assetType)) {
      return res.status(400).json({ error: 'assetType must be crypto, stock, or etf' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be greater than 0' });
    }

    if (buyPrice < 0) {
      return res.status(400).json({ error: 'buyPrice cannot be negative' });
    }

    const stmt = db.prepare(`
      INSERT INTO assets (assetName, symbol, assetType, quantity, buyPrice, currentPrice, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      assetName.trim(),
      symbol.toUpperCase().trim(),
      assetType,
      quantity,
      buyPrice,
      currentPrice || buyPrice, // Default currentPrice to buyPrice if not provided
      notes?.trim() || null
    );

    const newAsset = db.prepare('SELECT * FROM assets WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newAsset);
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
};

// Update existing asset
export const updateAsset = (req, res) => {
  try {
    const { id } = req.params;
    const { assetName, symbol, assetType, quantity, buyPrice, currentPrice, notes } = req.body;

    // Check if asset exists
    const existing = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Validation
    if (assetType && !['crypto', 'stock', 'etf'].includes(assetType)) {
      return res.status(400).json({ error: 'assetType must be crypto, stock, or etf' });
    }

    if (quantity !== undefined && quantity <= 0) {
      return res.status(400).json({ error: 'quantity must be greater than 0' });
    }

    if (buyPrice !== undefined && buyPrice < 0) {
      return res.status(400).json({ error: 'buyPrice cannot be negative' });
    }

    // Update only provided fields
    const updates = {
      assetName: assetName?.trim() ?? existing.assetName,
      symbol: symbol?.toUpperCase().trim() ?? existing.symbol,
      assetType: assetType ?? existing.assetType,
      quantity: quantity ?? existing.quantity,
      buyPrice: buyPrice ?? existing.buyPrice,
      currentPrice: currentPrice ?? existing.currentPrice,
      notes: notes !== undefined ? (notes?.trim() || null) : existing.notes,
    };

    const stmt = db.prepare(`
      UPDATE assets
      SET assetName = ?, symbol = ?, assetType = ?, quantity = ?, buyPrice = ?, currentPrice = ?, notes = ?
      WHERE id = ?
    `);

    stmt.run(
      updates.assetName,
      updates.symbol,
      updates.assetType,
      updates.quantity,
      updates.buyPrice,
      updates.currentPrice,
      updates.notes,
      id
    );

    const updatedAsset = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    res.json(updatedAsset);
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

// Delete asset
export const deleteAsset = (req, res) => {
  try {
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM assets WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    db.prepare('DELETE FROM assets WHERE id = ?').run(id);
    res.json({ message: 'Asset deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
};

// Batch update prices for crypto assets
export const updateCryptoPrices = (req, res) => {
  try {
    const { prices } = req.body; // { BTC: 50000, ETH: 3000, ... }

    if (!prices || typeof prices !== 'object') {
      return res.status(400).json({ error: 'prices object is required' });
    }

    const updateStmt = db.prepare(`
      UPDATE assets SET currentPrice = ? WHERE symbol = ? AND assetType = 'crypto'
    `);

    const updateMany = db.transaction((priceMap) => {
      let updated = 0;
      for (const [symbol, price] of Object.entries(priceMap)) {
        const result = updateStmt.run(price, symbol.toUpperCase());
        updated += result.changes;
      }
      return updated;
    });

    const updatedCount = updateMany(prices);
    res.json({ message: `Updated ${updatedCount} asset prices` });
  } catch (error) {
    console.error('Error updating crypto prices:', error);
    res.status(500).json({ error: 'Failed to update prices' });
  }
};
