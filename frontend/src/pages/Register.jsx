import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Smartphone, ShieldCheck, Lock, User } from 'lucide-react';

const Register = ({ onRegister }) => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'customer';
  const [role, setRole] = useState(initialRole);
  const [authMethod, setAuthMethod] = useState('email'); // email, phone, google
  
  // Registration common states
  const [name, setName] = useState('');
  
  // Email states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const navigate = useNavigate();

  const handleEmailRegister = (e) => {
    e.preventDefault();
    const userSession = {
      name: name,
      email: email,
      role: role
    };

    if (onRegister) onRegister(userSession);
    navigate(`/${role}`);
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setPhoneError('Please enter your full name first.');
      return;
    }
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError('');
    const randomOtp = '123456';
    setSimulatedOtp(randomOtp);
    setOtpSent(true);
    alert(`📱 OTP Simulation: A 6-digit OTP code [${randomOtp}] has been sent to +91 ${phoneNumber}.`);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp) {
      setPhoneError('Invalid OTP code. Please enter 123456.');
      return;
    }
    
    const userSession = {
      name: name,
      email: `${phoneNumber}@phone.com`,
      role: role
    };

    if (onRegister) onRegister(userSession);
    navigate(`/${role}`);
  };

  const handleGoogleRegister = () => {
    const userSession = {
      name: 'Google User',
      email: 'google.user@gmail.com',
      role: role
    };

    if (onRegister) onRegister(userSession);
    alert('🌐 Google Registration successful! Redirecting...');
    navigate(`/${role}`);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', maxWidth: '500px' }}>
      <div className="card glass">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
        
        {/* Auth Method Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
          {['email', 'phone', 'google'].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setAuthMethod(method);
                setPhoneError('');
                setOtpSent(false);
                setOtpCode('');
              }}
              style={{
                flex: 1,
                padding: '0.75rem 0',
                background: 'none',
                border: 'none',
                borderBottom: authMethod === method ? '2px solid var(--primary)' : '2px solid transparent',
                color: authMethod === method ? 'white' : 'var(--text-muted)',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
                textTransform: 'capitalize'
              }}
            >
              {method === 'google' ? 'Google' : method === 'phone' ? 'Phone OTP' : 'Email'}
            </button>
          ))}
        </div>

        {/* EMAIL REGISTER */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="password" 
                  className="form-input" 
                  required 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Register As</label>
              <select 
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shopkeeper</option>
                <option value="rider">Delivery Partner</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              Register with Email
            </button>
          </form>
        )}

        {/* PHONE OTP REGISTER */}
        {authMethod === 'phone' && (
          <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <div style={{ position: 'relative' }}>
                  <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <span style={{ position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>+91</span>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required 
                    placeholder="Enter 10-digit number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    style={{ paddingLeft: '4.5rem' }}
                  />
                </div>
              </div>
            ) : (
              <div className="form-group animate-fade-in">
                <label className="form-label">Verify One-Time Password</label>
                <div style={{ position: 'relative' }}>
                  <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--success)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Enter 6-digit OTP (123456)" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{ paddingLeft: '2.5rem', letterSpacing: '0.2em', fontWeight: 'bold' }}
                  />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'left' }}>
                  Simulated OTP sent to +91 {phoneNumber}. Enter <strong style={{ color: 'var(--accent)' }}>123456</strong> to verify.
                </p>
              </div>
            )}

            {phoneError && (
              <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'left' }}>{phoneError}</p>
            )}

            <div className="form-group">
              <label className="form-label">Register As</label>
              <select 
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shopkeeper</option>
                <option value="rider">Delivery Partner</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
              {otpSent ? 'Verify OTP & Register' : 'Send OTP'}
            </button>

            {otpSent && (
              <button 
                type="button" 
                onClick={() => { setOtpSent(false); setOtpCode(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '1rem', textDecoration: 'underline', fontSize: '0.85rem', display: 'block', margin: '1rem auto 0 auto' }}
              >
                Change Phone Number
              </button>
            )}
          </form>
        )}

        {/* GOOGLE REGISTER */}
        {authMethod === 'google' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Connect with your Google Account to create a hyperlocal delivery account instantly.
            </p>
            
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Register As</label>
              <select 
                className="form-input" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
              >
                <option value="customer">Customer</option>
                <option value="shopkeeper">Shopkeeper</option>
                <option value="rider">Delivery Partner</option>
              </select>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleRegister} 
              className="btn btn-secondary" 
              style={{ width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'white', color: '#0f172a', border: 'none', fontWeight: 'bold' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '0.2rem' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Register with Google
            </button>
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
