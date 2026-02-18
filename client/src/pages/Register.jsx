import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, Lock, Mail, User } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary-color)', padding: '0.75rem', borderRadius: '12px', color: 'white', marginBottom: '1rem' }}>
                        <Wallet size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem' }}>Create your account</h2>
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Start tracking your expenses and take control of your financial future today.</p>
                </div>

                {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem' }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="input-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {password && (
                            <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '4px' }}>
                                    {[1, 2, 3, 4].map((step) => {
                                        let strength = 0;
                                        if (password.length > 5) strength++;
                                        if (password.length > 8) strength++;
                                        if (/[A-Z]/.test(password)) strength++;
                                        if (/[0-9]/.test(password)) strength++;

                                        let color = '#e5e7eb';
                                        if (strength >= step) {
                                            if (strength <= 1) color = '#ef4444'; // Red
                                            else if (strength <= 3) color = '#f59e0b'; // Yellow
                                            else color = '#10b981'; // Green
                                        }

                                        return (
                                            <div key={step} style={{ flex: 1, background: color, borderRadius: '2px', transition: 'background 0.3s' }}></div>
                                        );
                                    })}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Password Strength: <span style={{
                                        fontWeight: 600,
                                        color: password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? '#10b981' :
                                            password.length > 5 ? '#f59e0b' : '#ef4444'
                                    }}>
                                        {password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'Strong' :
                                            password.length > 5 ? 'Medium' : 'Weak'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">Create Account</button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 500 }}>Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
