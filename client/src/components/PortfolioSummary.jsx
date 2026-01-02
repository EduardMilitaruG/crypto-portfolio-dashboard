import { useMemo } from 'react';

// Calculate and display portfolio summary statistics
function PortfolioSummary({ assets }) {
  const summary = useMemo(() => {
    if (!assets || assets.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalProfitLoss: 0,
        profitLossPercent: 0,
        cryptoValue: 0,
        stockValue: 0,
        etfValue: 0,
        assetCount: 0,
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    let cryptoValue = 0;
    let stockValue = 0;
    let etfValue = 0;

    assets.forEach((asset) => {
      const value = asset.quantity * asset.currentPrice;
      const cost = asset.quantity * asset.buyPrice;

      totalValue += value;
      totalCost += cost;

      switch (asset.assetType) {
        case 'crypto':
          cryptoValue += value;
          break;
        case 'stock':
          stockValue += value;
          break;
        case 'etf':
          etfValue += value;
          break;
      }
    });

    const totalProfitLoss = totalValue - totalCost;
    const profitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalProfitLoss,
      profitLossPercent,
      cryptoValue,
      stockValue,
      etfValue,
      assetCount: assets.length,
    };
  }, [assets]);

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const isProfit = summary.totalProfitLoss >= 0;

  return (
    <div className="portfolio-summary">
      <div className="summary-card main-card">
        <h2>Portfolio Value</h2>
        <div className="value-large">{formatCurrency(summary.totalValue)}</div>
        <div className={`profit-loss ${isProfit ? 'profit' : 'loss'}`}>
          <span className="pl-value">{formatCurrency(summary.totalProfitLoss)}</span>
          <span className="pl-percent">({formatPercent(summary.profitLossPercent)})</span>
        </div>
        <div className="cost-basis">Cost Basis: {formatCurrency(summary.totalCost)}</div>
      </div>

      <div className="summary-cards-row">
        <div className="summary-card">
          <h3>Crypto</h3>
          <div className="value-medium">{formatCurrency(summary.cryptoValue)}</div>
          <div className="allocation">
            {summary.totalValue > 0
              ? `${((summary.cryptoValue / summary.totalValue) * 100).toFixed(1)}%`
              : '0%'}
          </div>
        </div>

        <div className="summary-card">
          <h3>Stocks</h3>
          <div className="value-medium">{formatCurrency(summary.stockValue)}</div>
          <div className="allocation">
            {summary.totalValue > 0
              ? `${((summary.stockValue / summary.totalValue) * 100).toFixed(1)}%`
              : '0%'}
          </div>
        </div>

        <div className="summary-card">
          <h3>ETFs</h3>
          <div className="value-medium">{formatCurrency(summary.etfValue)}</div>
          <div className="allocation">
            {summary.totalValue > 0
              ? `${((summary.etfValue / summary.totalValue) * 100).toFixed(1)}%`
              : '0%'}
          </div>
        </div>

        <div className="summary-card">
          <h3>Assets</h3>
          <div className="value-medium">{summary.assetCount}</div>
          <div className="allocation">Total Holdings</div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioSummary;
