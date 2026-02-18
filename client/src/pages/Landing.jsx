import { Link } from 'react-router-dom';
import { Wallet, PieChart, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const Landing = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{ padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                        <Wallet size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>ExpenseMe</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '0.5rem' }}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {user ? (
                        <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Dashboard</Link>
                    ) : (
                        <>
                            <button onClick={() => setShowLogin(true)} className="btn" style={{ color: 'var(--text-secondary)', background: 'transparent' }}>Log In</button>
                            <button onClick={() => setShowRegister(true)} className="btn btn-primary">Get Started</button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 2rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, background: 'linear-gradient(to right, var(--primary-color), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Master Your Money <br /> with ExpenseMe
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
                    Track expenses, analyze spending habits, and achieve your financial goals with our premium, easy-to-use expense tracker.
                </p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
                    {user ? (
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Go to Dashboard <ArrowRight size={20} />
                        </Link>
                    ) : (
                        <>
                            <button onClick={() => setShowRegister(true)} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                                Start Tracking Free <ArrowRight size={20} />
                            </button>
                            <button onClick={() => setShowLogin(true)} className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '1rem 2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                                View Demo
                            </button>
                        </>
                    )}
                </div>

                {/* Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', maxWidth: '1200px' }}>

                    <div className="card" style={{ textAlign: 'left' }}>
                        <div style={{ width: '48px', height: '48px', background: 'var(--primary-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                            <Wallet size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Expense Tracking</h3>
                        <p>Log transactions instantly and keep track of where your money goes with our intuitive interface.</p>
                    </div>

                    <div className="card" style={{ textAlign: 'left' }}>
                        <div style={{ width: '48px', height: '48px', background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534', marginBottom: '1.5rem' }}>
                            <PieChart size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Smart Analytics</h3>
                        <p>Visualize your spending patterns with beautiful charts and gain actionable insights.</p>
                    </div>

                    <div className="card" style={{ textAlign: 'left' }}>
                        <div style={{ width: '48px', height: '48px', background: '#fef9c3', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854d0e', marginBottom: '1.5rem' }}>
                            <Shield size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Secure & Private</h3>
                        <p>Your financial data is encrypted and secure. We prioritize your privacy above all.</p>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)', transition: 'background-color 0.3s ease' }}>
                <p>&copy; 2026 ExpenseMe. All rights reserved.</p>
            </footer>
            {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />}
            {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />}
        </div>
    );
};

export default Landing;
