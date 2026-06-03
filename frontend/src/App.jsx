import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import RiderDashboard from './pages/RiderDashboard';

// Custom Route Guard for protecting pages based on session and roles
const ProtectedRoute = ({ children, allowedRole, user }) => {
  if (!user) {
    return <Navigate to={`/login?role=${allowedRole}`} replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    // If logged in as different role, redirect to login page for the correct role
    return <Navigate to={`/login?role=${allowedRole}`} replace />;
  }
  return children;
};

// Wrappers for /login and /register to handle cross-role switching and pre-selection
const LoginRouteWrapper = ({ currentUser, onLogout, onLogin }) => {
  const [searchParams] = useSearchParams();
  const targetRole = searchParams.get('role');

  if (currentUser && targetRole && currentUser.role !== targetRole) {
    onLogout();
    return <Login onLogin={onLogin} />;
  }

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Login onLogin={onLogin} />;
};

const RegisterRouteWrapper = ({ currentUser, onLogout, onLogin }) => {
  const [searchParams] = useSearchParams();
  const targetRole = searchParams.get('role');

  if (currentUser && targetRole && currentUser.role !== targetRole) {
    onLogout();
    return <Register onRegister={onLogin} />;
  }

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <Register onRegister={onLogin} />;
};

function App() {
  const [cart, setCart] = useState([]);
  
  // Persisted Session user state
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Shared active products catalog state
  const [products, setProducts] = useState([
    { id: 1, name: 'Premium Hair Serum', price: '₹649', image: '🧴', category: 'Beauty', store: 'Organic Farms', active: true },
    { id: 2, name: 'Handcrafted Bomber Jacket', price: '₹6,999', image: '🧥', category: 'Fashion', store: 'Organic Farms', active: true },
    { id: 3, name: 'ON Gold Standard Whey 1kg', price: '₹3,200', image: '🥤', category: 'Medicine', store: 'Organic Farms', active: true },
    { id: 4, name: 'Dyson V8 Cordless Vacuum', price: '₹24,900', image: '🧹', category: 'Home', store: 'Organic Farms', active: true }
  ]);

  // Shared active orders/shipments state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-9831',
      customer: 'Rohan Sharma',
      address: 'Greenwood Apartments, Sector 45',
      items: '1x Premium Hair Serum, 1x Multivitamin Complex',
      total: '₹1,099',
      status: 'Placed', // Placed, Rider Assigned, Picked Up, Out for Delivery, Delivered
      riderName: 'Vikram Singh',
      riderPhone: '+91 98765 43210',
      time: '10 mins ago',
      simulating: false
    },
    {
      id: 'ORD-7210',
      customer: 'Aisha Patel',
      address: 'Block C, Oakwood Residency',
      items: '2x Handcrafted Bomber Jacket',
      total: '₹13,998',
      status: 'Delivered',
      riderName: 'Amit Kumar',
      riderPhone: '+91 87654 32109',
      time: '2 hours ago',
      simulating: false
    }
  ]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Clear location and cart for privacy
    setCart([]);
  };

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar cart={cart} user={currentUser} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <LoginRouteWrapper currentUser={currentUser} onLogout={handleLogout} onLogin={handleLogin} />
          } />
          <Route path="/register" element={
            <RegisterRouteWrapper currentUser={currentUser} onLogout={handleLogout} onLogin={handleLogin} />
          } />
          
          <Route path="/customer" element={
            <CustomerDashboard cart={cart} setCart={setCart} products={products} orders={orders} setOrders={setOrders} user={currentUser} onLogout={handleLogout} />
          } />
          
          <Route path="/shopkeeper" element={
            <ProtectedRoute allowedRole="shopkeeper" user={currentUser}>
              <ShopkeeperDashboard products={products} setProducts={setProducts} orders={orders} setOrders={setOrders} user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
          
          <Route path="/rider" element={
            <ProtectedRoute allowedRole="rider" user={currentUser}>
              <RiderDashboard user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


