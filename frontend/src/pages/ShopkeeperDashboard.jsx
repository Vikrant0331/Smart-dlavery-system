import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Trash2, X, Upload, ShoppingBag, Check, MapPin, Phone, Play, RefreshCw, Layers } from 'lucide-react';
import './ShopkeeperDashboard.css';

// Popular catalog templates for quick listing
const catalogPresets = [
  { name: 'iPhone 15 Pro Max', price: '129900', image: '📱', category: 'Electronics' },
  { name: 'MacBook Air M3', price: '114900', image: '💻', category: 'Electronics' },
  { name: 'ON Gold Standard Whey 1kg', price: '3200', image: '🥤', category: 'Medicine' },
  { name: 'Adidas Ultraboost Sneakers', price: '5499', image: '👟', category: 'Fashion' },
  { name: 'Premium Hair Serum', price: '649', image: '🧴', category: 'Beauty' },
  { name: 'Dyson V8 Cordless Vacuum', price: '24900', image: '🧹', category: 'Home' }
];

// Quick presets inside the simplified modal for autofill
const modalPresets = [
  { name: 'iPhone 15 Pro Max', price: '129900', image: '📱' },
  { name: 'ON Whey Protein 1kg', price: '3200', image: '🥤' },
  { name: 'Adidas Sports Sneakers', price: '5499', image: '👟' },
  { name: 'Organic Hair Serum', price: '649', image: '🧴' }
];

const ShopkeeperDashboard = ({ products = [], setProducts, orders = [], setOrders, user, onLogout }) => {
  // Shop Name & Address States
  const [shopName, setShopName] = useState('Organic Farms');
  const [shopAddress, setShopAddress] = useState('Sector 45, Noida, UP');
  const [isEditingShopName, setIsEditingShopName] = useState(false);
  const [tempShopName, setTempShopName] = useState('Organic Farms');
  const [tempShopAddress, setTempShopAddress] = useState('Sector 45, Noida, UP');

  const toggleProductActive = (productId) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newActive = !p.active;
          showToastMessage(`Status: "${p.name}" is now ${newActive ? 'Active' : 'Inactive'}!`);
          return { ...p, active: newActive };
        }
        return p;
      })
    );
  };

  // Form States for Simplified Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [newProductImagePreview, setNewProductImagePreview] = useState('');

  // Toast System State
  const [toast, setToast] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'inventory'); // inventory, tracking
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (tab === 'inventory' || tab === 'tracking')) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const simulationTimers = useRef({});

  // Display Toast
  const showToastMessage = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  // Save Shop Name and Address Handler
  const handleSaveShopName = () => {
    if (tempShopName.trim() && tempShopAddress.trim()) {
      const updatedName = tempShopName.trim();
      const updatedAddress = tempShopAddress.trim();
      setShopName(updatedName);
      setShopAddress(updatedAddress);
      
      // Retroactively update all listed products to show this new shop name
      setProducts(prev => prev.map(p => ({ ...p, store: updatedName })));
      
      setIsEditingShopName(false);
      showToastMessage(`🏪 Shop profile updated: "${updatedName}" at "${updatedAddress}"`);
    }
  };

  // Image Upload File Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProductImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProductImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setNewProductImageFile(null);
    setNewProductImagePreview('');
  };

  // Manual Add Product Submit (3 fields: Name, Image, Price)
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) return;

    // Build product card image
    const finalImage = newProductImagePreview || '📦';

    const newProduct = {
      id: Date.now(),
      name: newProductName,
      price: `₹${parseFloat(newProductPrice).toLocaleString()}`,
      image: finalImage,
      category: 'Store Product',
      store: shopName, // Dynamic store name
      active: true
    };

    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    showToastMessage(`🎉 Product "${newProductName}" has been listed under "${shopName}"!`);

    // Reset fields
    setNewProductName('');
    setNewProductPrice('');
    setNewProductImageFile(null);
    setNewProductImagePreview('');
    setShowAddModal(false);
  };

  // One-click quick-list template adding
  const handleQuickListProduct = (preset) => {
    const newProduct = {
      id: Date.now(),
      name: preset.name,
      price: `₹${parseFloat(preset.price).toLocaleString()}`,
      image: preset.image,
      category: preset.category,
      store: shopName, // Dynamic store name
      active: true
    };

    setProducts((prevProducts) => [newProduct, ...prevProducts]);
    showToastMessage(`⚡ Quick Listed: "${preset.name}" added under "${shopName}"!`);
  };

  // Autofill form presets in modal
  const handleAutofillPreset = (preset) => {
    setNewProductName(preset.name);
    setNewProductPrice(preset.price);
    setNewProductImageFile(null);
    setNewProductImagePreview(preset.image);
    showToastMessage(`📝 Preset Loaded: ${preset.name}`);
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
    if (product) {
      showToastMessage(`🗑️ Removed: "${product.name}" deleted from your catalog.`);
    }
  };

  // Order Tracking Status Flow
  const statusStages = ['Placed', 'Rider Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'];

  // Manual Step Forward
  const advanceOrderStatus = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const currentIndex = statusStages.indexOf(order.status);
          if (currentIndex < statusStages.length - 1) {
            const nextStatus = statusStages[currentIndex + 1];
            showToastMessage(`🛵 Order ${order.id} updated: ${nextStatus}`);
            return { ...order, status: nextStatus };
          }
        }
        return order;
      })
    );
  };

  // Automatic Simulation Runner
  const runAutomaticSimulation = (orderId) => {
    // Disable buttons during simulation
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, simulating: true, status: 'Placed' } : order))
    );
    showToastMessage(`🚀 Started delivery simulation for Order ${orderId}`);

    let currentStageIndex = 0;
    
    // Clear previous timer if exists
    if (simulationTimers.current[orderId]) {
      clearInterval(simulationTimers.current[orderId]);
    }

    simulationTimers.current[orderId] = setInterval(() => {
      currentStageIndex += 1;
      const nextStatus = statusStages[currentStageIndex];

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.id === orderId) {
            if (currentStageIndex === statusStages.length - 1) {
              clearInterval(simulationTimers.current[orderId]);
              showToastMessage(`🎉 Order ${orderId} has been successfully Delivered!`);
              return { ...order, status: nextStatus, simulating: false };
            }
            showToastMessage(`🛵 Order ${orderId} updated: ${nextStatus}`);
            return { ...order, status: nextStatus };
          }
          return order;
        })
      );
    }, 2800);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(simulationTimers.current).forEach(clearInterval);
    };
  }, []);

  return (
    <div className="container shopkeeper-container animate-fade-in">
      
      {/* Toast Alert */}
      {toast && (
        <div className="toast-popup animate-scale-in">
          <span>{toast}</span>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0 }}>My Shop Dashboard</h2>
            {user && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontWeight: 'bold' }}>
                👤 Owner: {user.name} ({user.email})
              </span>
            )}
          </div>
          {isEditingShopName ? (
            <div className="shop-name-edit-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={tempShopName}
                  onChange={(e) => setTempShopName(e.target.value)}
                  className="shop-name-input"
                  autoFocus
                  maxLength={40}
                  placeholder="Enter Shop Name"
                />
                <input 
                  type="text" 
                  value={tempShopAddress}
                  onChange={(e) => setTempShopAddress(e.target.value)}
                  className="shop-name-input"
                  maxLength={100}
                  placeholder="Enter Shop Address"
                  style={{ width: '280px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={handleSaveShopName} className="btn-save-shop">Save Profile</button>
                <button onClick={() => setIsEditingShopName(false)} className="btn-cancel-shop">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="shop-name-display-container">
              <p className="shop-sub-info">
                <span className="shop-name-highlight">🏪 {shopName}</span> 
                <span className="shop-address-highlight">📍 {shopAddress}</span>
                <button 
                  onClick={() => {
                    setTempShopName(shopName);
                    setTempShopAddress(shopAddress);
                    setIsEditingShopName(true);
                  }} 
                  className="edit-shop-btn"
                  title="Rename your store & address"
                >
                  ✏️ Edit Profile
                </button>
                <span> • Partner ID: #SF-83920</span>
              </p>
            </div>
          )}
        </div>
        <div className="header-actions">
          <div className="dashboard-tabs">
            <button 
              onClick={() => setActiveTab('inventory')} 
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            >
              <Layers size={16} /> Inventory
            </button>
            <button 
              onClick={() => setActiveTab('tracking')} 
              className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
            >
              <ShoppingBag size={16} /> Track Sold Items
            </button>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={20} /> Add Product
          </button>
          <button 
            onClick={onLogout} 
            className="btn btn-secondary" 
            style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.1)', height: '42px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Metrics Stats Grid */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-label">Total Orders Today</div>
          <div className="stats-value">{orders.length}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">Active Listed Products</div>
          <div className="stats-value">{products.filter(p => p.active).length}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">Total Shop Revenue</div>
          <div className="stats-value">
            ₹{(
              orders.reduce((sum, order) => {
                const numericVal = parseInt(order.total.replace(/[^\d]/g, ''), 10) || 0;
                return sum + (order.status === 'Delivered' ? numericVal : 0);
              }, 0) + 8450
            ).toLocaleString()}
          </div>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Quick-Add Suggestions Catalog Section */}
          <div className="presets-section">
            <h3 className="section-subtitle">💡 Quick List Suggestions</h3>
            <p className="presets-desc">Instantly list common local catalog items in one single click, without filling forms.</p>
            <div className="presets-container hide-scrollbar">
              {catalogPresets.map((preset, index) => (
                <div key={index} className="preset-card">
                  <div className="preset-img-wrapper">{preset.image}</div>
                  <div className="preset-details">
                    <h4 className="preset-name">{preset.name}</h4>
                    <p className="preset-price">₹{parseInt(preset.price).toLocaleString()}</p>
                    <button 
                      type="button" 
                      onClick={() => handleQuickListProduct(preset)}
                      className="quick-list-btn"
                    >
                      + Quick List
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Product Listings Section */}
          <h3 className="dashboard-section-title">My Active Catalog</h3>
          {products.length === 0 ? (
            <div className="stats-card empty-catalog" style={{ padding: '4rem 2rem', textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1.25rem' }}>📦</div>
              <h4>Your Catalog is Empty</h4>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                List your products so customers nearby can discover and purchase them instantly! Choose a template or click "Add Product" above.
              </p>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="listings-grid">
              {products.map((product) => (
                <div key={product.id} className={`listing-card animate-fade-in ${product.active ? 'active-item' : 'inactive-item'}`}>
                  <div className="listing-img-box">
                    {product.image && (product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('blob:')) ? (
                      <img src={product.image} alt={product.name} className="listing-uploaded-image" />
                    ) : (
                      <div className="listing-emoji">{product.image || '📦'}</div>
                    )}
                  </div>
                  <div className="listing-details">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span className={`status-toggle-pill ${product.active ? 'active' : 'inactive'}`} onClick={() => toggleProductActive(product.id)}>
                        {product.active ? '● Active' : '○ Inactive'}
                      </span>
                    </div>
                    <h4 className="listing-name" title={product.name}>{product.name}</h4>
                    <div className="listing-category-wrapper">
                      <span className="listing-category">{product.store}</span>
                    </div>
                    <p className="listing-price">{product.price}</p>
                    
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button 
                        onClick={() => toggleProductActive(product.id)}
                        className="toggle-status-btn"
                        style={{ flexGrow: 1 }}
                      >
                        {product.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="delete-listing-btn-small"
                        title="Delete listing"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* TRACKING TAB - Order Tracking Dashboard Section */
        <div className="tracking-section animate-fade-in">
          <h3 className="dashboard-section-title">📦 Sold Items Tracking Pipeline</h3>
          <p className="section-desc">Track and monitor your sold products in real-time through all courier stages until final delivery.</p>

          <div className="orders-list">
            {orders.map((order) => {
              const currentStageIndex = statusStages.indexOf(order.status);
              
              return (
                <div key={order.id} className="order-tracking-card animate-fade-in">
                  {/* Order Meta Header */}
                  <div className="order-track-header">
                    <div className="order-meta-left">
                      <div className="order-badge">Active Shipment</div>
                      <h4>Order {order.id}</h4>
                      <p className="order-items-desc">{order.items}</p>
                      <div className="meta-footer">
                        <span className="meta-pill"><MapPin size={12} /> {order.customer} • {order.address}</span>
                        <span className="meta-pill"><Phone size={12} /> Rider: {order.riderName}</span>
                      </div>
                    </div>
                    <div className="order-meta-right">
                      <div className="order-total">{order.total}</div>
                      <div className={`status-pill ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {/* Visual Stepper Tracker */}
                  <div className="stepper-wrapper">
                    <div className="stepper-progress-line">
                      <div 
                        className="stepper-progress-fill" 
                        style={{ width: `${(currentStageIndex / (statusStages.length - 1)) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="stepper-nodes">
                      {statusStages.map((stage, sIdx) => {
                        const isCompleted = sIdx < currentStageIndex;
                        const isActive = sIdx === currentStageIndex;
                        const isPending = sIdx > currentStageIndex;
                        
                        let labelText = stage;
                        let nodeIcon = '🕒';
                        if (stage === 'Placed') { nodeIcon = '📥'; labelText = 'Order Placed'; }
                        if (stage === 'Rider Assigned') { nodeIcon = '🛵'; labelText = 'Rider Assigned'; }
                        if (stage === 'Picked Up') { nodeIcon = '📦'; labelText = 'Picked Up'; }
                        if (stage === 'Out for Delivery') { nodeIcon = '🚚'; labelText = 'Out for Delivery'; }
                        if (stage === 'Delivered') { nodeIcon = '🎉'; labelText = 'Delivered!'; }

                        return (
                          <div 
                            key={stage} 
                            className={`stepper-node-container ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isPending ? 'pending' : ''}`}
                          >
                            <div className="stepper-node">
                              {isCompleted ? <Check size={14} className="node-check-icon" /> : <span>{nodeIcon}</span>}
                            </div>
                            <span className="stepper-label">{labelText}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Simulation Bar */}
                  <div className="order-actions-bar">
                    <div className="actions-left-note">
                      {order.simulating ? (
                        <span className="simulation-pulse">● System simulating real-time delivery runner...</span>
                      ) : (
                        <span>Simulate delivery statuses to track the pipeline:</span>
                      )}
                    </div>
                    <div className="actions-buttons">
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        disabled={order.status === 'Delivered' || order.simulating}
                        className="action-btn-secondary"
                      >
                        <RefreshCw size={14} className={order.simulating ? 'spin-anim' : ''} /> Next Stage
                      </button>
                      <button
                        type="button"
                        onClick={() => runAutomaticSimulation(order.id)}
                        disabled={order.simulating}
                        className="action-btn-primary"
                      >
                        <Play size={14} /> {order.status === 'Delivered' ? 'Simulate Again' : 'Auto Simulate Delivery'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Product Modal Overlay (Exactly 3 fields: Name, Image, Price) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card animate-scale-in">
            <div className="modal-header">
              <h3>List New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="modal-close">
                <X size={20} />
              </button>
            </div>

            {/* Modal Autofill presets section */}
            <div className="modal-presets-section">
              <span className="presets-label">⚡ Quick Presets (Click to Autofill)</span>
              <div className="modal-presets-row">
                {modalPresets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAutofillPreset(preset)}
                    className="modal-preset-pill"
                  >
                    <span>{preset.image}</span> {preset.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddProductSubmit} className="modal-form">
              <div>
                <label className="form-label">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Premium Hair Serum" 
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Product Price (in ₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 649" 
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Product Image File</label>
                <div className="file-upload-wrapper">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-upload-input"
                    id="modal-image-upload"
                  />
                  <label htmlFor="modal-image-upload" className="file-upload-box">
                    <Upload size={20} className="upload-box-icon" />
                    <span className="upload-box-title">
                      {newProductImageFile ? newProductImageFile.name : 'Click to Upload Image File'}
                    </span>
                    <span className="upload-box-subtitle">Supports JPG, PNG, WEBP</span>
                  </label>
                </div>

                {/* Upload Image Preview Box */}
                {newProductImagePreview && (
                  <div className="upload-preview-box">
                    <div className="preview-media-wrapper">
                      {newProductImagePreview.startsWith('data:') || newProductImagePreview.startsWith('blob:') ? (
                        <img src={newProductImagePreview} alt="Preview" className="preview-image" />
                      ) : (
                        <div className="preview-emoji-wrapper">{newProductImagePreview}</div>
                      )}
                      <button type="button" className="remove-preview-btn" onClick={clearImagePreview}>
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', fontWeight: 'bold', borderRadius: '10px', marginTop: '0.5rem' }}>
                Add to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopkeeperDashboard;
