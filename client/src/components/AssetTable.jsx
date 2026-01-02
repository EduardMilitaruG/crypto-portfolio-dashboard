import { useState, useMemo } from 'react';

// Display assets in a sortable table with profit/loss indicators
function AssetTable({ assets, onEdit, onDelete, loading }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterType, setFilterType] = useState('all');

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

  // Calculate derived values for each asset
  const assetsWithCalculations = useMemo(() => {
    return assets.map((asset) => {
      const totalValue = asset.quantity * asset.currentPrice;
      const totalCost = asset.quantity * asset.buyPrice;
      const profitLoss = totalValue - totalCost;
      const profitLossPercent = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0;

      return {
        ...asset,
        totalValue,
        totalCost,
        profitLoss,
        profitLossPercent,
      };
    });
  }, [assets]);

  // Filter assets by type
  const filteredAssets = useMemo(() => {
    if (filterType === 'all') return assetsWithCalculations;
    return assetsWithCalculations.filter((asset) => asset.assetType === filterType);
  }, [assetsWithCalculations, filterType]);

  // Sort assets
  const sortedAssets = useMemo(() => {
    if (!sortConfig.key) return filteredAssets;

    return [...filteredAssets].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  // Get asset type badge color
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'crypto': return 'badge-crypto';
      case 'stock': return 'badge-stock';
      case 'etf': return 'badge-etf';
      default: return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading assets...</div>;
  }

  if (assets.length === 0) {
    return (
      <div className="empty-state">
        <p>No assets in your portfolio yet.</p>
        <p>Add your first asset to get started!</p>
      </div>
    );
  }

  return (
    <div className="asset-table-container">
      <div className="table-controls">
        <div className="filter-buttons">
          <button
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => setFilterType('all')}
          >
            All ({assets.length})
          </button>
          <button
            className={filterType === 'crypto' ? 'active' : ''}
            onClick={() => setFilterType('crypto')}
          >
            Crypto
          </button>
          <button
            className={filterType === 'stock' ? 'active' : ''}
            onClick={() => setFilterType('stock')}
          >
            Stocks
          </button>
          <button
            className={filterType === 'etf' ? 'active' : ''}
            onClick={() => setFilterType('etf')}
          >
            ETFs
          </button>
        </div>
      </div>

      <table className="asset-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('assetName')} className="sortable">
              Asset{getSortIndicator('assetName')}
            </th>
            <th onClick={() => handleSort('assetType')} className="sortable">
              Type{getSortIndicator('assetType')}
            </th>
            <th onClick={() => handleSort('quantity')} className="sortable">
              Qty{getSortIndicator('quantity')}
            </th>
            <th onClick={() => handleSort('buyPrice')} className="sortable">
              Buy Price{getSortIndicator('buyPrice')}
            </th>
            <th onClick={() => handleSort('currentPrice')} className="sortable">
              Current{getSortIndicator('currentPrice')}
            </th>
            <th onClick={() => handleSort('totalValue')} className="sortable">
              Value{getSortIndicator('totalValue')}
            </th>
            <th onClick={() => handleSort('profitLoss')} className="sortable">
              P/L{getSortIndicator('profitLoss')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAssets.map((asset) => (
            <tr key={asset.id}>
              <td>
                <div className="asset-name">
                  <strong>{asset.symbol}</strong>
                  <span className="asset-full-name">{asset.assetName}</span>
                </div>
              </td>
              <td>
                <span className={`badge ${getTypeBadgeClass(asset.assetType)}`}>
                  {asset.assetType}
                </span>
              </td>
              <td>{asset.quantity.toLocaleString()}</td>
              <td>{formatCurrency(asset.buyPrice)}</td>
              <td>{formatCurrency(asset.currentPrice)}</td>
              <td>{formatCurrency(asset.totalValue)}</td>
              <td className={asset.profitLoss >= 0 ? 'profit' : 'loss'}>
                <div className="pl-cell">
                  <span>{formatCurrency(asset.profitLoss)}</span>
                  <span className="pl-percent">{formatPercent(asset.profitLossPercent)}</span>
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => onEdit(asset)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(asset)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTable;
