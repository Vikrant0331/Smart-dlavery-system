import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Camera, ScanLine, 
  ShoppingBag, Shirt, Smartphone, Sparkles, Laptop, Pill, Home as HomeIcon,
  PlaySquare, Grid, User, ShoppingCart, Package, MapPin
} from 'lucide-react';
import './CustomerDashboard.css';

const categories = [
  { name: 'Home', icon: HomeIcon, active: true },
  { name: 'For You', icon: ShoppingBag, active: false },
  { name: 'Fashion', icon: Shirt, active: false },
  { name: 'Beauty', icon: Sparkles, active: false },
  { name: 'Electronics & Mobiles', icon: Laptop, active: false },
  { name: 'Medicine', icon: Pill, active: false },
  
];

const recommendedProducts = [
  { id: 1, name: 'iPhone 15 Pro', store: 'Croma Electronics', image: '📱', price: '₹1,29,900' },
  { id: 2, name: 'MacBook Air M3', store: 'Reliance Digital', image: '💻', price: '₹1,14,900' },
  { id: 3, name: 'OnePlus 12 5G', store: 'Mobile World', image: '📱', price: '₹64,999' },
  { id: 4, name: 'Sony WH-1000XM5', store: 'Stereo Zone', image: '🎧', price: '₹29,990' },
  { id: 5, name: 'Samsung S24 Ultra', store: 'Galaxy Store', image: '📱', price: '₹1,29,999' },
  { id: 6, name: 'iPad Air M2', store: 'Apple Store', image: '📟', price: '₹59,900' },
  { id: 7, name: 'Redmi Note 13 Pro', store: 'Mi Plaza', image: '📱', price: '₹25,999' },
  { id: 8, name: 'Dell XPS 13', store: 'Laptop Lounge', image: '💻', price: '₹99,990' },
];

const productsByCategory = {
  'Fashion': [
    { id: 201, name: 'Zara Men Denim Slim Fit Jeans', store: 'Zara Store', image: '👖', price: '₹2,999' },
    { id: 202, name: 'Adidas Ultraboost Sneakers', store: 'Adidas Hub', image: '👟', price: '₹5,499' },
    { id: 203, name: 'Premium Linen Solid Shirt', store: 'Zara Menswear', image: '👕', price: '₹2,499' },
    { id: 204, name: 'Puma Active Sports Tee', store: 'Puma Outlet', image: '👕', price: '₹1,299' },
    { id: 205, name: 'Ray-Ban Classic Wayfarer', store: 'Optics World', image: '🕶️', price: '₹7,990' },
    { id: 206, name: 'Fossil Chronograph Watch', store: 'Watch Boutique', image: '⌚', price: '₹9,495' },
    { id: 207, name: 'Nike Fleece Sports Hoodie', store: 'Sports Express', image: '🧥', price: '₹3,995' },
    { id: 208, name: 'Handcrafted Bomber Jacket', store: 'Leather Craft', image: '🧥', price: '₹6,999' },
  ],
  'Beauty': [
    { id: 301, name: 'Mac Retro Matte Lipstick', store: 'Beauty Hub', image: '💄', price: '₹1,950' },
    { id: 302, name: 'Clinique Moisture Hydrator', store: 'Skincare Co.', image: '🧴', price: '₹2,900' },
    { id: 303, name: 'Chanel No 5 Parfum Luxe', store: 'Scent & Co.', image: '🧪', price: '₹12,500' },
    { id: 304, name: 'Maybelline Lash Sensational', store: 'Cosmetics Center', image: '👁️', price: '₹499' },
    { id: 305, name: 'L\'Oreal Professional Serum', store: 'Salon Style', image: '🧴', price: '₹649' },
    { id: 306, name: 'Cetaphil Gentle Cleanser', store: 'Derma Pharmacy', image: '🧴', price: '₹990' },
  ],
  'Electronics & Mobiles': [
    { id: 101, name: 'iPhone 15 Pro Max', store: 'Croma Electronics', image: '📱', price: '₹1,29,900' },
    { id: 102, name: 'MacBook Air M3 13"', store: 'Reliance Digital', image: '💻', price: '₹1,14,900' },
    { id: 103, name: 'OnePlus 12 5G (Green)', store: 'Mobile World', image: '📱', price: '₹64,999' },
    { id: 104, name: 'Sony WH-1000XM5 Noise Cancelling', store: 'Stereo Zone', image: '🎧', price: '₹29,990' },
    { id: 105, name: 'Samsung Galaxy S24 Ultra', store: 'Galaxy Store', image: '📱', price: '₹1,29,999' },
    { id: 106, name: 'iPad Air M2 11"', store: 'Apple Store', image: '📟', price: '₹59,900' },
    { id: 107, name: 'Redmi Note 13 Pro Plus', store: 'Mi Plaza', image: '📱', price: '₹25,999' },
    { id: 108, name: 'Dell XPS 13 Core Ultra', store: 'Laptop Lounge', image: '💻', price: '₹99,990' },
  ],
  'Medicine': [
    { id: 401, name: 'ON Multivitamin Complex', store: 'Apollo Pharmacy', image: '💊', price: '₹450' },
    { id: 402, name: 'ON Gold Standard Whey 1kg', store: 'GNC Nutrition', image: '🥤', price: '₹3,200' },
    { id: 403, name: 'Omron Digital Thermometer', store: 'MedLife', image: '🌡️', price: '₹299' },
    { id: 404, name: 'Vicks Vaporub Ointment', store: 'Wellness Chemist', image: '🧴', price: '₹145' },
    { id: 405, name: 'Omega-3 Triple Strength Fish Oil', store: 'NutriPlus', image: '💊', price: '₹850' },
    { id: 406, name: 'Comprehensive First Aid Kit', store: 'Emergency Care', image: '💼', price: '₹699' },
  ],
  'Home': [
    { id: 501, name: 'Orthopedic Memory Foam Pillow', store: 'Sleepwell', image: '🛏️', price: '₹1,499' },
    { id: 502, name: 'Tefal Non-stick Fry Pan', store: 'Prestige Store', image: '🍳', price: '₹999' },
    { id: 503, name: 'Ultrasonic Aroma Diffuser', store: 'Home Decor', image: '🏺', price: '₹1,199' },
    { id: 504, name: 'Philips Hue LED Smart Bulb', store: 'Philips Light', image: '💡', price: '₹699' },
    { id: 505, name: 'Dyson V8 Cordless Vacuum', store: 'Dyson Gallery', image: '🧹', price: '₹24,900' },
    { id: 506, name: 'Exclusive Ceramic Dinner Set', store: 'Tablewares', image: '🍽️', price: '₹3,499' },
  ],
};

const trendingSearches = [
  { text: 'iPhone 15 Pro Max', icon: '📱' },
  { text: 'MacBook Air M3', icon: '💻' },
  { text: 'Zara Men Denim Slim Fit Jeans', icon: '👖' },
  { text: 'ON Gold Standard Whey 1kg', icon: '🥤' },
  { text: 'Mac Retro Matte Lipstick', icon: '💄' }
];

const CustomerDashboard = ({ cart, setCart, products = [], orders = [], setOrders, user, onLogout, notifications = [], setNotifications }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'Home');
  const [selectedCategory, setSelectedCategory] = useState('For You', 'Home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Location Verification States
  const [customerLocation, setCustomerLocation] = useState(localStorage.getItem('customerLocation') || '');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [tempLocation, setTempLocation] = useState(localStorage.getItem('customerLocation') || '');

  // Checkout States
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [selectedProductForBuy, setSelectedProductForBuy] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Normalize categories for mapping active shopkeeper products
  const getNormalizedCategory = (cat) => {
    if (!cat) return 'Home';
    const c = cat.toLowerCase();
    if (c.includes('electronic') || c.includes('mobile') || c.includes('phone') || c.includes('laptop')) return 'Electronics & Mobiles';
    if (c.includes('fashion') || c.includes('cloth') || c.includes('shoe') || c.includes('wear') || c.includes('jacket') || c.includes('jeans')) return 'Fashion';
    if (c.includes('beauty') || c.includes('serum') || c.includes('lipstick') || c.includes('cosmetic')) return 'Beauty';
    if (c.includes('medicine') || c.includes('health') || c.includes('pharma') || c.includes('whey') || c.includes('vitamin')) return 'Medicine';
    if (c.includes('home') || c.includes('appliance') || c.includes('vacuum') || c.includes('bed')) return 'Home';
    return 'Home';
  };

  const getActiveProductsForCategory = (categoryName) => {
    const shopkeeperActive = products.filter(p => p.active);
    const matchingShopkeeper = shopkeeperActive.filter(p => getNormalizedCategory(p.category) === categoryName);
    const defaultProducts = productsByCategory[categoryName] || [];
    return [...matchingShopkeeper, ...defaultProducts];
  };

  const getFilteredProducts = () => {
    if (!searchQuery) return [];
    
    const shopkeeperActive = products.filter(p => p.active);
    
    const allProducts = [
      ...shopkeeperActive,
      ...recommendedProducts,
      ...Object.values(productsByCategory).flat()
    ];
    
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    );
    
    return uniqueProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.store && product.store.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      setCustomerLocation(tempLocation.trim());
      localStorage.setItem('customerLocation', tempLocation.trim());
      setShowLocationModal(false);
      showToast(`📍 Delivery location updated successfully!`);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      alert('⚠️ You must log in to add products to the cart!');
      navigate('/login');
      return;
    }
    setCart((prevCart) => [...prevCart, product]);
    showToast(`🛒 ${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    const removedItem = cart[indexToRemove];
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== indexToRemove));
    showToast(`🗑️ Removed ${removedItem.name} from cart!`);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const numericPrice = parseInt(item.price.replace(/[^\d]/g, ''), 10) || 0;
      return sum + numericPrice;
    }, 0);
  };

  const handleCheckoutCart = () => {
    if (!user) {
      alert('⚠️ You must log in to checkout and buy products!');
      navigate('/login');
      return;
    }
    if (!customerLocation) {
      setShowLocationModal(true);
      showToast(`⚠️ Please enter your delivery location before checking out!`);
      return;
    }
    const totalAmount = calculateTotal();
    const cartItemSummary = {
      name: `${cart.length} Cart Items`,
      price: `₹${totalAmount.toLocaleString()}`,
      store: 'Smart Combined Delivery',
      image: '🛍️'
    };
    setSelectedProductForBuy(cartItemSummary);
    setUpiId('');
    setPaymentSuccess(false);
    setShowUPIModal(true);
  };

  const handleBuyNow = (product) => {
    if (!user) {
      alert('⚠️ You must log in to buy products!');
      navigate('/login');
      return;
    }
    if (!customerLocation) {
      setShowLocationModal(true);
      showToast(`⚠️ Please enter your delivery location before checking out!`);
      return;
    }
    setSelectedProductForBuy(product);
    setUpiId('');
    setPaymentSuccess(false);
    setShowUPIModal(true);
  };

  const handleProcessUPIPayment = (e) => {
    e.preventDefault();
    if (!upiId) return;
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowUPIModal(false);
      setPaymentSuccess(false);

      const targetStoreName = selectedProductForBuy.store || (cart.length > 0 ? cart[0].store : 'Organic Farms');
      const targetStoreAddress = selectedProductForBuy.storeAddress || (cart.length > 0 ? cart[0].storeAddress : 'Sector 45, Noida, UP');

      // Create new order entry in global orders
      const newOrder = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: user?.name || 'Customer (You)',
        address: customerLocation,
        items: selectedProductForBuy.name.includes('Cart Items') 
          ? cart.map(c => c.name).join(', ') 
          : selectedProductForBuy.name,
        total: selectedProductForBuy.price,
        status: 'Placed',
        store: targetStoreName,
        storeAddress: targetStoreAddress,
        riderName: 'Vikram Singh',
        riderPhone: '+91 98765 43210',
        time: 'Just now',
        simulating: false
      };

      setOrders(prev => [newOrder, ...prev]);

      // Add notifications for Customer, Shopkeeper, and Rider
      const customerNotif = {
        id: Date.now(),
        role: 'customer',
        message: `🎉 Order placed successfully! Tracking ID: ${newOrder.id}`,
        details: `Items: ${newOrder.items} • Total: ${newOrder.total} • Deliver to: ${newOrder.address}`,
        read: false
      };

      const shopkeeperNotif = {
        id: Date.now() + 1,
        role: 'shopkeeper',
        message: `🏪 New Order received for your store "${newOrder.store}"!`,
        details: `Order ID: ${newOrder.id} • Items: ${newOrder.items} • Delivery: ${newOrder.address}`,
        read: false
      };

      const riderNotif = {
        id: Date.now() + 2,
        role: 'rider',
        message: `🛵 New delivery job available nearby!`,
        details: `Job ID: ${newOrder.id} • Pickup: ${newOrder.store} (${newOrder.storeAddress}) ➔ Deliver: ${newOrder.address}`,
        read: false
      };

      setNotifications(prev => [customerNotif, shopkeeperNotif, riderNotif, ...prev]);

      if (selectedProductForBuy.name.includes('Cart Items')) {
        setCart([]);
      }
      
      showToast(`🎉 Order placed successfully for ${selectedProductForBuy.name}!`);
    }, 2500);
  };

  return (
    <div className="app-layout animate-fade-in" style={{ paddingBottom: '70px' }}>
      
      {/* Top Header - Red Theme */}
      <div className="customer-header">
        <div className="container header-container">
          {/* Location Delivery Bar */}
          <div className="location-bar" onClick={() => { setTempLocation(customerLocation); setShowLocationModal(true); }}>
            <MapPin size={16} color="white" style={{ marginRight: '0.4rem', flexShrink: 0 }} />
            <span className="location-text" style={{ flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {customerLocation ? `Deliver to: ${customerLocation}` : '⚠️ Click here to Set your Delivery Location to order'}
            </span>
            <button className="location-change-btn" style={{ background: 'none', border: 'none', color: '#fde047', fontWeight: '800', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}>
              {customerLocation ? 'Change' : 'Set Address'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <Search size={20} color="#64748b" style={{ marginRight: '0.5rem' }} />
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab('Home');
              }}
              className="search-input"
            />
            <Camera size={20} color="#64748b" className="camera-icon" />
            <ScanLine size={20} color="#64748b" className="scan-icon" />

            {/* Recommendations Dropdown */}
            {isSearchFocused && (
              <div className="dropdown-container animate-scale-in">
                {!searchQuery ? (
                  <>
                    <h4 className="dropdown-header">🔥 Trending Searches</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {trendingSearches.map((item, index) => (
                        <div 
                          key={index}
                          onMouseDown={() => {
                            setSearchQuery(item.text);
                            setIsSearchFocused(false);
                          }}
                          className="dropdown-item"
                        >
                          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="dropdown-header">💡 Search Suggestions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {getFilteredProducts().slice(0, 5).length === 0 ? (
                        <div style={{ color: '#94a3b8', padding: '0.5rem', fontSize: '0.9rem' }}>No suggestions found</div>
                      ) : (
                        getFilteredProducts().slice(0, 5).map((product) => (
                          <div 
                            key={product.id}
                            onMouseDown={() => {
                              setSearchQuery(product.name);
                              setIsSearchFocused(false);
                            }}
                            className="dropdown-item"
                          >
                            <span style={{ fontSize: '1.2rem' }}>{product.image}</span>
                            <div className="dropdown-item-details">
                              <span>{product.name}</span>
                              <span className="dropdown-item-store">in {product.store}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Categories Scroll */}
          <div className="category-scroll hide-scrollbar">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name && !searchQuery;
              return (
                <div key={idx} onClick={() => { setSelectedCategory(cat.name); setSearchQuery(''); setActiveTab('Home'); }} className="category-tab">
                  <div className={`category-icon-wrapper ${isActive ? 'active' : ''}`}>
                    <Icon size={24} color="white" />
                  </div>
                  <span className={`category-text ${isActive ? 'active' : ''}`}>
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {activeTab === 'Home' && selectedCategory === 'For You' && !searchQuery && (
        <>
          <div className="container" style={{ paddingTop: '2rem' }}>
            {/* Banner Section */}
            <div className="banner-section">
              <div className="banner-content">
                <span className="banner-badge">POCO</span>
                <h2 className="banner-title">POCO X8 Pro 5G<br/>From ₹3,555/M*</h2>
                <p className="banner-subtitle">POCO's most durable phone ever*</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem', padding: '0.75rem 2rem' }}>Shop Now</button>
              </div>
              <div className="banner-decor">📱</div>
            </div>

            {/* Recommended Section */}
            <div className="recommended-section">
              <h3 className="recommended-title">Vikrant, still looking for these?</h3>
              
              <div className="recommended-scroll hide-scrollbar">
                {[...products.filter(p => p.active), ...recommendedProducts].map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="recommended-card">
                    <div className="recommended-emoji">
                      {item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('blob:')) ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      ) : (
                        item.image
                      )}
                    </div>
                    <div className="recommended-details">
                      <p className="recommended-name">{item.name}</p>
                      <p className="recommended-price">{item.price}</p>
                      <p className="recommended-store">{item.store}</p>
                      
                      <div className="recommended-actions">
                        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }} className="add-to-cart-btn" style={{ padding: '0.45rem 0', fontSize: '0.78rem' }}>
                          Add to Cart
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleBuyNow(item); }} className="buy-now-btn" style={{ padding: '0.45rem 0', fontSize: '0.78rem' }}>
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Grid */}
            <h3 style={{ marginBottom: '1rem', color: '#0f172a', textAlign: 'left' }}>Top Categories</h3>
            <div className="grid grid-cols-4 grid-top-categories">
               <div className="category-card" onClick={() => setSelectedCategory('Beauty')}>
                  <div className="category-card-emoji">🧴</div>
                  <p className="category-card-text">Beauty Sale</p>
               </div>
               <div className="category-card" onClick={() => setSelectedCategory('Medicine')}>
                  <div className="category-card-emoji">💊</div>
                  <p className="category-card-text">Health & Pharma</p>
               </div>
               <div className="category-card" onClick={() => setSelectedCategory('Electronics & Mobiles')}>
                  <div className="category-card-emoji">📱🔌</div>
                  <p className="category-card-text">Electronics & Mobiles</p>
               </div>
               <div className="category-card" onClick={() => setSelectedCategory('Fashion')}>
                  <div className="category-card-emoji">👗</div>
                  <p className="category-card-text">Fashion</p>
               </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'Home' && selectedCategory !== 'For You' && !searchQuery && (
        <div className="container product-page-container">
          {/* Breadcrumbs */}
          <div className="breadcrumb-container">
            <span onClick={() => setSelectedCategory('For You')} className="breadcrumb-home">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{selectedCategory}</span>
          </div>

          {/* Heading */}
          <div className="collection-header">
            <h2 className="collection-title">{selectedCategory} Collection</h2>
            <span className="collection-count">
              {getActiveProductsForCategory(selectedCategory).length} items suggested
            </span>
          </div>

          {/* Product Grid */}
          <div className="grid product-grid">
            {getActiveProductsForCategory(selectedCategory).map((product, idx) => (
              <div key={`${product.id}-${idx}`} className="product-card animate-fade-in">
                <div className="product-emoji">
                  {product.image && (product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('blob:')) ? (
                    <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                  ) : (
                    product.image
                  )}
                </div>
                <div className="product-details">
                  <h4 className="product-title" title={product.name}>{product.name}</h4>
                  <p className="product-price">{product.price}</p>
                  <p className="product-store">Store: <span className="product-store-highlight">{product.store}</span></p>
                  
                  <div className="product-actions">
                    <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="add-to-cart-btn">
                      Add to Cart
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }} className="buy-now-btn">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Home' && searchQuery && (
        <div className="container product-page-container">
          {/* Breadcrumbs */}
          <div className="breadcrumb-container">
            <span onClick={() => setSearchQuery('')} className="breadcrumb-home">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Search results for "{searchQuery}"</span>
          </div>

          {/* Heading */}
          <div className="collection-header">
            <h2 className="collection-title">Search Results</h2>
            <span className="collection-count">
              {getFilteredProducts().length} items found
            </span>
          </div>

          {getFilteredProducts().length === 0 ? (
            <div className="cart-empty-card animate-fade-in">
              <div className="cart-empty-icon">🔍</div>
              <h3 className="cart-empty-title">No results found</h3>
              <p className="cart-empty-text">We couldn't find anything matching "{searchQuery}". Try searching for 'iPhone', 'Zara', 'Pill', or 'Tee'!</p>
              <button onClick={() => setSearchQuery('')} className="cart-empty-btn">
                Clear Search
              </button>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid product-grid">
              {getFilteredProducts().map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="product-card animate-fade-in">
                  <div className="product-emoji">
                    {product.image && (product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('blob:')) ? (
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      product.image
                    )}
                  </div>
                  <div className="product-details">
                    <h4 className="product-title" title={product.name}>{product.name}</h4>
                    <p className="product-price">{product.price}</p>
                    <p className="product-store">Store: <span className="product-store-highlight">{product.store}</span></p>
                    
                    <div className="product-actions">
                      <button onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} className="add-to-cart-btn">
                        Add to Cart
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }} className="buy-now-btn">
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Cart' && (
        <div className="container product-page-container">
          <h2 className="cart-page-title">My Shopping Cart</h2>

          {cart.length === 0 ? (
            <div className="cart-empty-card animate-fade-in">
              <div className="cart-empty-icon">🛒</div>
              <h3 className="cart-empty-title">Your cart is empty</h3>
              <p className="cart-empty-text">Add some premium items from our local stores to start your smart delivery!</p>
              <button onClick={() => { setActiveTab('Home'); setSelectedCategory('For You'); }} className="cart-empty-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-grid">
              {/* Cart Items List */}
              <div className="cart-items-list">
                {cart.map((item, idx) => (
                  <div key={idx} className="cart-item-row animate-fade-in">
                    <span className="cart-item-emoji">
                      {item.image && (item.image.startsWith('data:') || item.image.startsWith('http') || item.image.startsWith('blob:')) ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                      ) : (
                        item.image
                      )}
                    </span>
                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-store">Store: <span className="cart-item-store-name">{item.store}</span></p>
                      <p className="cart-item-price">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCart(idx)} 
                      className="cart-item-remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Summary Panel */}
              <div className="summary-panel">
                <h3 className="summary-title">Order Summary</h3>
                
                <div className="summary-rows-container">
                  <div className="summary-row">
                    <span>Items ({cart.length})</span>
                    <span className="summary-value">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span className="summary-success-val">FREE</span>
                  </div>
                  <div className="summary-total-row">
                    <span>Total Amount</span>
                    <span className="summary-total-price">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutCart}
                  className="summary-checkout-btn"
                >
                  Pay via UPI ₹{calculateTotal().toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Account' && (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#0f172a', textAlign: 'left' }}>My Profile</h2>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', backgroundColor: 'white' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b' }}>
              <User size={40} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ marginBottom: '0.2rem', color: '#0f172a' }}>{user?.name || 'John Doe'}</h3>
              <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '0.5rem' }}>{user?.email || 'john.doe@example.com'}</p>
              <span style={{ backgroundColor: '#dbeafe', color: '#1e3a8a', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{user?.role || 'Customer'}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
              <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>My Orders</span>
              <span style={{ color: '#64748b' }}>&gt;</span>
            </div>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
              <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>Saved Addresses</span>
              <span style={{ color: '#64748b' }}>&gt;</span>
            </div>
            <div className="card" style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
              <span style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '1.1rem' }}>Payment Methods</span>
              <span style={{ color: '#64748b' }}>&gt;</span>
            </div>
            <div className="card" onClick={onLogout} style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }}>
              <span style={{ fontWeight: 'bold', color: '#dc2626', fontSize: '1.1rem' }}>Log Out</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Track' && (
        <div className="container product-page-container">
          <h2 className="cart-page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>📦 My Live Shipments</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'left' }}>Monitor your orders and delivery partners in real-time.</p>
          
          {orders.length === 0 ? (
            <div className="cart-empty-card animate-fade-in">
              <div className="cart-empty-icon">📦</div>
              <h3 className="cart-empty-title">No orders placed yet</h3>
              <p className="cart-empty-text">Once you place an order, you will be able to track your delivery partner live here!</p>
              <button onClick={() => setActiveTab('Home')} className="cart-empty-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {orders.map((order) => {
                const statusStages = ['Placed', 'Rider Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'];
                const currentStageIndex = statusStages.indexOf(order.status);
                
                return (
                  <div key={order.id} className="order-tracking-card animate-fade-in" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)', textAlign: 'left' }}>
                    <div className="order-track-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          Active Order
                        </span>
                        <h3 style={{ margin: '0.4rem 0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 'bold' }}>Order {order.id}</h3>
                        <p style={{ margin: '0 0 0.5rem 0', color: '#334155', fontWeight: '500' }}>{order.items}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b' }}>
                          <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>📍 Delivery Address: {order.address}</span>
                          <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>🛵 Rider: {order.riderName}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 0.4rem 0', fontWeight: '800', fontSize: '1.4rem', color: '#0f172a' }}>{order.total}</p>
                        <span className={`status-pill ${order.status.toLowerCase().replace(/\s/g, '-')}`} style={{ display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress timeline */}
                    <div className="stepper-wrapper" style={{ position: 'relative', margin: '1.5rem 0 2rem 0' }}>
                      <div className="stepper-progress-line" style={{ position: 'absolute', top: '15px', left: '2rem', right: '2rem', height: '4px', backgroundColor: '#e2e8f0', zIndex: 1 }}>
                        <div className="stepper-progress-fill" style={{ width: `${(currentStageIndex / (statusStages.length - 1)) * 100}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.8s ease' }}></div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                        {statusStages.map((stage, idx) => {
                          const isCompleted = idx < currentStageIndex;
                          const isActive = idx === currentStageIndex;
                          
                          let emoji = '🕒';
                          if (stage === 'Placed') emoji = '📥';
                          if (stage === 'Rider Assigned') emoji = '🛵';
                          if (stage === 'Picked Up') emoji = '📦';
                          if (stage === 'Out for Delivery') emoji = '🚚';
                          if (stage === 'Delivered') emoji = '🎉';

                          return (
                            <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80px' }}>
                              <div style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '50%', 
                                backgroundColor: isCompleted ? '#dcfce7' : isActive ? '#dbeafe' : '#f1f5f9', 
                                border: `2px solid ${isActive ? '#2563eb' : isCompleted ? '#16a34a' : '#cbd5e1'}`, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontSize: '0.9rem', 
                                color: isCompleted ? '#16a34a' : '#0f172a',
                                boxShadow: isActive ? '0 0 10px rgba(37, 99, 235, 0.2)' : 'none'
                              }}>
                                {isCompleted ? '✓' : emoji}
                              </div>
                              <span style={{ 
                                fontSize: '0.7rem', 
                                marginTop: '0.5rem', 
                                fontWeight: isActive || isCompleted ? 'bold' : '500', 
                                color: isActive ? '#2563eb' : isCompleted ? '#16a34a' : '#64748b', 
                                textAlign: 'center',
                                whiteSpace: 'nowrap'
                              }}>
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Tracking Map */}
                    {order.status !== 'Delivered' && (
                      <div style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', height: '220px' }}>
                        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
                          <span>🗺️ Live Delivery Map Route</span>
                          <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                            Rider is en route
                          </span>
                        </div>
                        <iframe 
                          title={`Tracking Map ${order.id}`}
                          width="100%" 
                          height="100%" 
                          style={{ border: 0 }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(order.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab !== 'Home' && activeTab !== 'Account' && activeTab !== 'Cart' && activeTab !== 'Track' && (
        <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
          <h2 style={{ color: '#64748b' }}>{activeTab} Content</h2>
          <p style={{ color: '#94a3b8' }}>Coming Soon...</p>
        </div>
      )}

      {/* Bottom Navigation - Hidden on Desktop */}
      <div className="hide-on-desktop" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '0.75rem 0', borderTop: '1px solid #e2e8f0', zIndex: 50 }}>
        {[
          { name: 'Home', icon: HomeIcon },
          { name: 'Track', icon: Package, badge: orders.filter(o => o.status !== 'Delivered').length },
          { name: 'Categories', icon: Grid },
          { name: 'Account', icon: User },
          { name: 'Cart', icon: ShoppingCart, badge: cart.length },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          return (
            <div key={item.name} onClick={() => { setActiveTab(item.name); setSearchParams({}); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}>
              <Icon size={24} color={isActive ? '#2563eb' : '#64748b'} />
              {item.badge > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#dc2626', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', padding: '0.1rem 0.3rem', borderRadius: '10px' }}>
                  {item.badge}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: isActive ? '#2563eb' : '#64748b', fontWeight: isActive ? 'bold' : 'normal' }}>
                {item.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Toast Notification popup */}
      {toast && (
        <div className="toast-notification">
          {toast}
        </div>
      )}

      {/* UPI Payment Modal overlay */}
      {showUPIModal && selectedProductForBuy && (
        <div className="upi-modal-overlay">
          <div className="upi-modal-card animate-scale-in">
            {!paymentSuccess ? (
              <>
                <div className="upi-modal-header">
                  <h3 className="upi-modal-title">UPI Instant Checkout</h3>
                  <button onClick={() => setShowUPIModal(false)} className="upi-modal-close-btn">&times;</button>
                </div>

                <div className="upi-modal-product-summary">
                  <span className="upi-modal-summary-emoji">{selectedProductForBuy.image}</span>
                  <div className="upi-modal-summary-details">
                    <h4 className="upi-modal-summary-name">{selectedProductForBuy.name}</h4>
                    <p className="upi-modal-summary-store">Store: {selectedProductForBuy.store}</p>
                    <p className="upi-modal-summary-price">{selectedProductForBuy.price}</p>
                  </div>
                </div>

                <form onSubmit={handleProcessUPIPayment}>
                  <label className="upi-modal-label">Enter UPI ID (e.g., name@okaxis)</label>
                  <input 
                    type="text" 
                    placeholder="username@upi" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    className="upi-modal-input"
                  />

                  <div className="upi-modal-presets">
                    <span className="upi-modal-preset-btn" onClick={() => setUpiId('gpay@okaxis')}>📱 GPay</span>
                    <span className="upi-modal-preset-btn" onClick={() => setUpiId('phonepe@ybl')}>🟣 PhonePe</span>
                    <span className="upi-modal-preset-btn" onClick={() => setUpiId('paytm@paytm')}>🔷 Paytm</span>
                  </div>

                  <button className="upi-modal-pay-btn" type="submit">
                    Pay {selectedProductForBuy.price}
                  </button>
                </form>
              </>
            ) : (
              <div className="upi-modal-success-screen">
                <div style={{ fontSize: '5rem', marginBottom: '1.5rem', animation: 'bounce 1s infinite' }}>✅</div>
                <h3 className="upi-modal-success-title">Processing UPI Payment</h3>
                <p className="upi-modal-success-text">Please approve the request on your UPI app...</p>
                <div className="upi-modal-spinner"></div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Location Input Modal overlay */}
      {showLocationModal && (
        <div className="upi-modal-overlay">
          <div className="upi-modal-card animate-scale-in" style={{ maxWidth: '400px' }}>
            <div className="upi-modal-header">
              <h3 className="upi-modal-title">📍 Confirm Delivery Location</h3>
              <button onClick={() => setShowLocationModal(false)} className="upi-modal-close-btn">&times;</button>
            </div>
            
            <form onSubmit={handleSaveLocation}>
              <label className="upi-modal-label" style={{ marginBottom: '0.5rem', display: 'block', fontSize: '0.85rem' }}>
                Please enter your shipping address to calculate routes:
              </label>
              <input 
                type="text" 
                placeholder="e.g. Greenwood Apartments, Sector 45" 
                value={tempLocation}
                onChange={(e) => setTempLocation(e.target.value)}
                required
                className="upi-modal-input"
                autoFocus
                style={{ marginBottom: '1rem' }}
              />
              {tempLocation.trim().length > 3 && (
                <div style={{ width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                  <iframe 
                    title="Google Location Preview"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(tempLocation)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              )}
              <button className="upi-modal-pay-btn" type="submit" style={{ backgroundColor: 'var(--success)', borderColor: 'var(--success)', color: '#0f172a', fontWeight: 'bold' }}>
                Set Address
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;
