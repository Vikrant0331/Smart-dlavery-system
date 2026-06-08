import { useState, useEffect } from 'react';
import { MapPin, Navigation, Check, DollarSign, Bell } from 'lucide-react';

const RiderDashboard = ({ user, onLogout, orders = [], setOrders, notifications = [], setNotifications }) => {
  const [toast, setToast] = useState('');

  const showToastMessage = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  // Show unread rider notifications on mount/updates
  useEffect(() => {
    if (!user) return;
    const unreadRiderNotifs = notifications.filter(n => n.role === 'rider' && !n.read);
    if (unreadRiderNotifs.length > 0) {
      unreadRiderNotifs.forEach((notif, idx) => {
        setTimeout(() => {
          showToastMessage(`🛵 Rider Alert: ${notif.message}`);
        }, idx * 1000);
      });
      // Mark as read
      setNotifications(prev => prev.map(n => n.role === 'rider' ? { ...n, read: true } : n));
    }
  }, [notifications, user]);

  // Handle accepting an available job
  const handleAcceptJob = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        showToastMessage(`✅ You accepted Order ${orderId}! Route assigned.`);
        
        // Add notifications for Customer & Shopkeeper
        const customerNotif = {
          id: Date.now(),
          role: 'customer',
          message: `🛵 Rider Assigned: Vikram Singh (You) has accepted your delivery!`,
          details: `Order: ${order.id} • Rider contact: +91 98765 43210`,
          read: false
        };

        const shopkeeperNotif = {
          id: Date.now() + 1,
          role: 'shopkeeper',
          message: `🛵 Rider Vikram Singh is traveling to pick up Order ${order.id}!`,
          details: `Shop: ${order.store} • Order: ${order.id}`,
          read: false
        };

        setNotifications(prevNotifs => [customerNotif, shopkeeperNotif, ...prevNotifs]);

        return {
          ...order,
          status: 'Rider Assigned',
          riderName: user?.name || 'Vikram Singh',
          riderPhone: '+91 98765 43210'
        };
      }
      return order;
    }));
  };

  // Handle advancing active order status
  const handleAdvanceStatus = (orderId, nextStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        showToastMessage(`🛵 Status updated to: ${nextStatus}`);

        // Add notifications for Customer & Shopkeeper
        const customerNotif = {
          id: Date.now(),
          role: 'customer',
          message: `📦 Delivery Update: Your order is now "${nextStatus}"!`,
          details: `Order: ${order.id} • Status updated by Rider ${user?.name}`,
          read: false
        };

        const shopkeeperNotif = {
          id: Date.now() + 1,
          role: 'shopkeeper',
          message: `📦 Delivery Update: Order ${order.id} is now "${nextStatus}"!`,
          details: `Store: ${order.store} • Status updated by Rider ${user?.name}`,
          read: false
        };

        setNotifications(prevNotifs => [customerNotif, shopkeeperNotif, ...prevNotifs]);

        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  // Filter orders
  const availableJobs = orders.filter(o => o.status === 'Placed');
  const activeJobs = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Placed' && o.riderName === (user?.name || 'Vikram Singh'));

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      
      {/* Toast Alert */}
      {toast && (
        <div className="toast-popup animate-scale-in" style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0f172a', border: '1px solid var(--primary)', padding: '1rem 1.5rem', borderRadius: '12px', zIndex: 1000, color: 'white', fontWeight: 'bold' }}>
          <span>{toast}</span>
        </div>
      )}

      {/* Dashboard Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Delivery Hub</h2>
          {user && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.3rem 0 0 0' }}>
              🏍️ Active Rider: <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.email})
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
        {/* Left Column: Live Navigation Map */}
        <div className="card" style={{ height: '520px', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
          {activeJobs.length > 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0.8rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: 'white', fontSize: '0.85rem' }}>🗺️ Live Navigation Map</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Route: {activeJobs[0].store} ➔ {activeJobs[0].address}
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--success)', color: '#0f172a', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>Google Maps Live</span>
              </div>
              <iframe 
                title="Rider Active Job Navigation"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(activeJobs[0].storeAddress || activeJobs[0].store || 'Sector 45, Noida')}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          ) : availableJobs.length > 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '0.8rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <strong style={{ color: 'white', fontSize: '0.85rem' }}>🗺️ Suggested Pickup Location</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Target: {availableJobs[0].store} ({availableJobs[0].storeAddress || 'Sector 45, Noida, UP'})
                </div>
              </div>
              <iframe 
                title="Rider Suggested Job Preview"
                width="100%" 
                height="100%" 
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(availableJobs[0].storeAddress || availableJobs[0].store || 'Sector 45, Noida, UP')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              <MapPin size={48} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
              <p style={{ fontWeight: 'bold', color: 'white', margin: '0 0 0.25rem 0' }}>Live Map Integration</p>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>(Google Maps API Coordinates Engaged)</p>
              <iframe 
                title="Rider Map Default"
                width="100%" 
                height="240px" 
                style={{ border: 0, marginTop: '1.5rem', borderRadius: '8px' }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=Noida,%20Uttar%20Pradesh&t=&z=12&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          )}
        </div>

        {/* Right Column: Suggested & Active Jobs */}
        <div>
          {/* Active Deliveries Control Panel */}
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'white' }}>
            <Navigation color="var(--success)" /> My Active Routes ({activeJobs.length})
          </h3>
          
          {activeJobs.length === 0 ? (
            <div className="card glass" style={{ marginBottom: '2rem', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active shipments. Accept a job from the suggestions below to start!
            </div>
          ) : (
            <div style={{ marginBottom: '2rem' }}>
              {activeJobs.map(job => (
                <div key={job.id} className="card glass" style={{ borderLeft: '4px solid var(--success)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        In Progress
                      </span>
                      <h4 style={{ margin: '0.3rem 0', color: 'white' }}>Order {job.id}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{job.items}</p>
                    </div>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{job.total}</span>
                  </div>

                  {/* Pickup & Delivery Location Box */}
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>🏪</span>
                      <strong>Pickup From:</strong>
                      <span style={{ color: 'var(--accent)' }}>{job.store} ({job.storeAddress || 'Sector 45, Noida, UP'})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>📍</span>
                      <strong>Deliver To:</strong>
                      <span style={{ color: 'var(--primary)' }}>{job.customer} ({job.address})</span>
                    </div>
                  </div>

                  {/* Stepper Status Indicators */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: job.status === 'Rider Assigned' ? 'bold' : 'normal', color: job.status === 'Rider Assigned' ? 'var(--primary)' : 'var(--text-muted)' }}>🛵 Assigned</span>
                    <span>➔</span>
                    <span style={{ fontWeight: job.status === 'Picked Up' ? 'bold' : 'normal', color: job.status === 'Picked Up' ? 'var(--accent)' : 'var(--text-muted)' }}>📦 Picked Up</span>
                    <span>➔</span>
                    <span style={{ fontWeight: job.status === 'Out for Delivery' ? 'bold' : 'normal', color: job.status === 'Out for Delivery' ? 'var(--secondary)' : 'var(--text-muted)' }}>🚚 Transit</span>
                  </div>

                  {/* Interactive Status advancer */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {job.status === 'Rider Assigned' && (
                      <button 
                        onClick={() => handleAdvanceStatus(job.id, 'Picked Up')} 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '0.6rem' }}
                      >
                        Confirm Package Pickup
                      </button>
                    )}
                    {job.status === 'Picked Up' && (
                      <button 
                        onClick={() => handleAdvanceStatus(job.id, 'Out for Delivery')} 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg, var(--secondary), #db2777)' }}
                      >
                        Start Delivery Run
                      </button>
                    )}
                    {job.status === 'Out for Delivery' && (
                      <button 
                        onClick={() => handleAdvanceStatus(job.id, 'Delivered')} 
                        className="btn btn-primary" 
                        style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg, var(--success), #059669)' }}
                      >
                        Mark as Successfully Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Available Jobs Suggested Panel */}
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'white' }}>
            <Navigation color="var(--accent)" /> Smart Suggested Pickups ({availableJobs.length})
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Available nearby orders waiting for a courier. Confirm to accept the route suggestion:
          </p>
          
          {availableJobs.length === 0 ? (
            <div className="card glass" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No nearby orders pending pickup. Enjoy your shift!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {availableJobs.map(order => (
                <div key={order.id} className="card glass" style={{ borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={{ background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent)', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                        ORD {order.id}
                      </span>
                      <h4 style={{ margin: '0.3rem 0', color: 'white' }}>{order.items}</h4>
                    </div>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>{order.total}</span>
                  </div>

                  {/* Geolocation Pickup & Delivery Details */}
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.3rem', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>🏪</span>
                      <strong>Pickup:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{order.store} ({order.storeAddress || 'Sector 45, Noida, UP'})</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>📍</span>
                      <strong>Deliver:</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{order.customer} ({order.address})</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAcceptJob(order.id)} 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--accent), #0d9488)' }}
                  >
                    Accept Route
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
