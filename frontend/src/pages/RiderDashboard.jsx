import { MapPin, Navigation } from 'lucide-react';

const RiderDashboard = ({ user, onLogout }) => {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Delivery Hub</h2>
          {user && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
              🏍️ Rider: <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.email})
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
            <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>Online & Tracking</span>
          </div>
          <button 
            onClick={onLogout} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Map View Placeholder */}
        <div className="card" style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', border: '2px dashed rgba(255,255,255,0.1)' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <MapPin size={48} style={{ margin: '0 auto', marginBottom: '1rem', color: 'var(--primary)' }} />
            <p>Live Map Integration</p>
            <p style={{ fontSize: '0.8rem' }}>(Google Maps API Required)</p>
          </div>
        </div>

        {/* Suggested Route */}
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation color="var(--accent)" /> Smart Route Suggestion
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Based on your current location and direction, we found 2 pickups on your way.</p>
          
          <div className="card glass" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong>Pickup 1: Green Grocery</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>0.5 miles away</p>
              </div>
              <span style={{ fontWeight: 'bold' }}>+$4.50</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Accept Route</button>
          </div>

          <div className="card glass" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <strong>Pickup 2: Morning Bakery</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>1.2 miles away</p>
              </div>
              <span style={{ fontWeight: 'bold' }}>+$3.20</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Accept Route</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
