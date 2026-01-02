import express from 'express';
import {
  getPrices,
  getPortfolioPrices,
  getSupportedCryptos,
  checkSymbol
} from '../controllers/priceController.js';

const router = express.Router();

// GET /api/prices?symbols=btc,eth,sol - Get live prices for specific symbols
router.get('/', getPrices);

// GET /api/prices/portfolio - Get and update prices for all crypto assets in portfolio
router.get('/portfolio', getPortfolioPrices);

// GET /api/prices/supported - Get list of all supported crypto symbols
router.get('/supported', getSupportedCryptos);

// GET /api/prices/check/:symbol - Check if a symbol is supported
router.get('/check/:symbol', checkSymbol);

export default router;
