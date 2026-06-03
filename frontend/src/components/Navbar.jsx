import { Link, useLocation } from 'react-router-dom';
import { 
  Package, LogIn, UserPlus, ShoppingCart, 
  User, ShoppingBag, Tag, Zap, MapPin, Heart, Bell, LogOut, ChevronDown,
  Store, Layers, TrendingUp, Compass
} from 'lucide-react';

const Navbar = ({ cart = [], user, onLogout }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const showCart = location.pathname.includes('/customer');
  const showAuth = !isHomePage;

  return (
    <nav className="navbar glass">
      <Link to="/" className="navbar-brand">
        <Package className="text-primary" />
        <span>SmartDeliv</span>
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {showCart && (
          <Link to="/customer?tab=Cart" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '0.5rem', transition: 'color 0.2s', fontWeight: '600' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-main)'}>
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cart.length > 0 && (
              <span style={{ backgroundColor: '#fde047', color: '#0f172a', fontSize: '0.75rem', fontWeight: '800', padding: '0.1rem 0.4rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>
                {cart.length}
              </span>
            )}
          </Link>
        )}
        
        {showAuth && (user ? (
          <div className="profile-menu-container">
            <button className="profile-trigger-btn">
              <span>👤 {user.name || 'User'}</span>
              <span style={{ color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.7rem' }}>({user.role})</span>
              <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>
            <div className="profile-dropdown-card">
              {user.role === 'customer' && (
                <>
                  <div className="dropdown-section-title">Your Account</div>
                  <Link to="/customer?tab=Account" className="dropdown-menu-item">
                    <User size={16} color="var(--primary)" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/customer?tab=Track" className="dropdown-menu-item">
                    <ShoppingBag size={16} color="var(--primary)" />
                    <span>Orders</span>
                  </Link>
                  <button onClick={() => alert('🎟️ Coupons: You have 3 active coupons! Simulated discount active.')} className="dropdown-menu-item">
                    <Tag size={16} color="var(--accent)" />
                    <span>Coupons</span>
                  </button>
                  <button onClick={() => alert('⚡ Supercoin: Balance 120 Coins. Redeemable on next checkout!')} className="dropdown-menu-item">
                    <Zap size={16} color="#fde047" />
                    <span>Supercoin</span>
                  </button>
                  <Link to="/customer?tab=Account" className="dropdown-menu-item">
                    <MapPin size={16} color="var(--primary)" />
                    <span>Saved Addresses</span>
                  </Link>
                  <button onClick={() => alert('❤️ Wishlist: Item added to wishlist!')} className="dropdown-menu-item">
                    <Heart size={16} color="var(--secondary)" />
                    <span>Wishlist</span>
                  </button>
                  <button onClick={() => alert('🔔 Notifications: No new alerts.')} className="dropdown-menu-item">
                    <Bell size={16} color="var(--accent)" />
                    <span>Notifications</span>
                  </button>
                </>
              )}

              {user.role === 'shopkeeper' && (
                <>
                  <div className="dropdown-section-title">Shopkeeper Hub</div>
                  <Link to="/shopkeeper?tab=inventory" className="dropdown-menu-item">
                    <User size={16} color="var(--primary)" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/shopkeeper?tab=inventory" className="dropdown-menu-item">
                    <Store size={16} color="var(--primary)" />
                    <span>Shop Profile</span>
                  </Link>
                  <Link to="/shopkeeper?tab=inventory" className="dropdown-menu-item">
                    <Layers size={16} color="var(--accent)" />
                    <span>Products Catalog</span>
                  </Link>
                  <Link to="/shopkeeper?tab=tracking" className="dropdown-menu-item">
                    <ShoppingBag size={16} color="var(--primary)" />
                    <span>Shipment Tracking</span>
                  </Link>
                  <button onClick={() => alert('📈 Shop Revenue: Simulated Store earnings are healthy! See details on Dashboard.')} className="dropdown-menu-item">
                    <TrendingUp size={16} color="var(--success)" />
                    <span>Sales & Analytics</span>
                  </button>
                  <button onClick={() => alert('🔔 Notifications: No new orders yet.')} className="dropdown-menu-item">
                    <Bell size={16} color="var(--accent)" />
                    <span>Notifications</span>
                  </button>
                </>
              )}

              {user.role === 'rider' && (
                <>
                  <div className="dropdown-section-title">Delivery Partner</div>
                  <Link to="/rider" className="dropdown-menu-item">
                    <User size={16} color="var(--primary)" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/rider" className="dropdown-menu-item">
                    <Compass size={16} color="var(--accent)" />
                    <span>Delivery Hub</span>
                  </Link>
                  <Link to="/rider" className="dropdown-menu-item">
                    <MapPin size={16} color="var(--primary)" />
                    <span>Active Route</span>
                  </Link>
                  <button onClick={() => alert('💰 Rider Earnings: Current shift earnings: ₹450.00')} className="dropdown-menu-item">
                    <TrendingUp size={16} color="var(--success)" />
                    <span>Rider Earnings</span>
                  </button>
                  <button onClick={() => alert('🔔 Notifications: No new routes assigned.')} className="dropdown-menu-item">
                    <Bell size={16} color="var(--accent)" />
                    <span>Notifications</span>
                  </button>
                </>
              )}

              <button onClick={onLogout} className="dropdown-menu-item logout-item">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <LogIn size={16} /> Login
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <UserPlus size={16} /> Register
            </Link>
          </>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;

