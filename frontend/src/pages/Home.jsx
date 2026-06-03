import { Link } from 'react-router-dom';
import { Shield, Zap, Map, Store } from 'lucide-react';

const Home = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Decentralized Hyperlocal Delivery</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
          Connecting local shopkeepers, customers, and delivery partners intelligently without centralized warehouses. Experience faster, cheaper, and smarter deliveries.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/customer" className="btn btn-primary">Start Shopping</Link>
          <Link to="/shopkeeper" className="btn btn-secondary">Become a Shopkeeper</Link>
          <Link to="/rider" className="btn btn-secondary">Become a Rider</Link>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="card">
          <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
            <Zap color="var(--accent)" size={32} />
          </div>
          <h3>Smart Route Optimization</h3>
          <p style={{ color: 'var(--text-muted)' }}>Our algorithm finds the nearest available delivery partner and suggests multiple pickups along their route to save time and fuel.</p>
        </div>
        <div className="card">
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
            <Map color="var(--primary)" size={32} />
          </div>
          <h3>Live Tracking</h3>
          <p style={{ color: 'var(--text-muted)' }}>Real-time location tracking for customers and delivery partners to ensure smooth and transparent deliveries.</p>
        </div>
        <div className="card">
          <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem' }}>
            <Store color="var(--secondary)" size={32} />
          </div>
          <h3>Support Local</h3>
          <p style={{ color: 'var(--text-muted)' }}>Empowering local shopkeepers to compete with large online platforms by providing a unified digital storefront.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

