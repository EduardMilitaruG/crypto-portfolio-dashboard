import express from 'express';
import {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  updateCryptoPrices
} from '../controllers/assetController.js';

const router = express.Router();

// GET /api/assets - Get all assets
router.get('/', getAllAssets);

// GET /api/assets/:id - Get single asset
router.get('/:id', getAssetById);

// POST /api/assets - Create new asset
router.post('/', createAsset);

// PUT /api/assets/:id - Update asset
router.put('/:id', updateAsset);

// DELETE /api/assets/:id - Delete asset
router.delete('/:id', deleteAsset);

// POST /api/assets/update-prices - Batch update crypto prices
router.post('/update-prices', updateCryptoPrices);

export default router;
