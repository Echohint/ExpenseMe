import { LayoutDashboard, History, PieChart, Settings, LogOut, Wallet, Crown, CreditCard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import SubscriptionModal from './SubscriptionModal';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate(); // Import this

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const { user } = useAuth(); // Get user to check premium status

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/history', label: 'History', icon: History },
        { path: '/analytics', label: 'Analytics', icon: PieChart },
        { path: '/ai-analysis', label: 'AI Analysis', icon: Crown },
        { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
        { path: '/data-portability', label: 'Data Portability', icon: Wallet },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border-color)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50,
            overflowY: 'auto'
        }} className="no-scrollbar">
            <div className="flex items-center gap-2 mb-8 px-2">
                <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px', color: 'white' }}>
                    <Wallet size={24} />
                </div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>ExpenseMe</h1>
            </div>

            <nav className="flex-col gap-2" style={{ display: 'flex', flex: 1 }}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive(item.path) ? 'var(--primary-color)' : 'var(--text-secondary)',
                            background: isActive(item.path) ? 'var(--primary-light)' : 'transparent',
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                        }}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div style={{ padding: '0 0.5rem 1rem 0.5rem' }}>
                {!user?.isPremium ? (
                    <button
                        onClick={() => setShowSubscriptionModal(true)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Crown size={18} />
                        Upgrade Premium
                    </button>
                ) : (
                    <div
                        onClick={() => setShowCelebration(true)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--success-bg)',
                            color: 'var(--success-text)',
                            fontWeight: 600,
                            border: '1px solid var(--success-text)',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Crown size={18} />
                        Premium Active
                    </div>
                )}
            </div>

            <button
                onClick={toggleTheme}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                }}
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 500,
                    marginTop: 'auto'
                }}
            >
                <LogOut size={20} />
                Sign Out
            </button>
            {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}

            {/* Premium Celebration Modal */}
            {showCelebration && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                    animation: 'fadeIn 0.3s'
                }} onClick={() => setShowCelebration(false)}>
                    <div style={{
                        textAlign: 'center',
                        color: 'white',
                        animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🐐</div>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            background: 'linear-gradient(to right, #fcd34d, #d97706)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '0.5rem',
                            textShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                            You are the GOAT!
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#e2e8f0', fontWeight: 500 }}>
                            Premium Member Status: LEGENDARY
                        </p>
                    </div>
                    {/* Simple confetti-like particles could be added here with CSS, usually best to keep it simple first */}
                </div>
            )}
        </aside >
    );
};

export default Sidebar;
