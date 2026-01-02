import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Price service for fetching live crypto prices
export const priceService = {
  // Fetch prices for specific symbols
  getPrices: async (symbols) => {
    const response = await api.get('/prices', {
      params: { symbols: symbols.join(',') },
    });
    return response.data;
  },

  // Fetch and update prices for all crypto assets in portfolio
  getPortfolioPrices: async () => {
    const response = await api.get('/prices/portfolio');
    return response.data;
  },

  // Get list of supported crypto symbols
  getSupportedSymbols: async () => {
    const response = await api.get('/prices/supported');
    return response.data;
  },

  // Check if a specific symbol is supported
  checkSymbol: async (symbol) => {
    const response = await api.get(`/prices/check/${symbol}`);
    return response.data;
  },
};

export default priceService;
