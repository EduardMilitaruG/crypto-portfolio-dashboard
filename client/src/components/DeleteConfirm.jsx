// Confirmation dialog for deleting assets
function DeleteConfirm({ asset, onConfirm, onCancel }) {
  if (!asset) return null;

  return (
    <div className="modal-overlay">
      <div className="modal modal-small">
        <div className="modal-header">
          <h2>Delete Asset</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete this asset?</p>
          <div className="delete-asset-info">
            <strong>{asset.symbol}</strong> - {asset.assetName}
          </div>
          <p className="warning">This action cannot be undone.</p>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-danger" onClick={() => onConfirm(asset.id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
