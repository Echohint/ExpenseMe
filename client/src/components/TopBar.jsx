import { useAuth } from '../context/AuthContext';
import { User, Bell, ChevronDown, LogOut, Settings, Menu, LayoutDashboard, History, PieChart, Database, CreditCard, Crown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SubscriptionModal from './SubscriptionModal';

const TopBar = ({ title }) => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-toggle')) {
                setShowMobileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div style={{
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-body)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 40,
            transition: 'background-color 0.3s ease'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    <Menu size={24} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Bell size={20} />
                </button>

                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease, border-color 0.3s ease'
                        }}
                    >
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                            <User size={18} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.name || user?.username || 'User'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.isPremium ? 'Premium Plan' : 'Free Plan'}</span>
                        </div>
                        <ChevronDown size={16} color="var(--text-secondary)" />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <div style={{
                            position: 'absolute',
                            top: '120%',
                            right: 0,
                            width: '200px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-lg)',
                            padding: '0.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            zIndex: 50
                        }}>
                            <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                            </div>

                            <button onClick={() => navigate('/settings')} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'var(--text-primary)', textAlign: 'left', fontSize: '0.9rem'
                            }} className="hover:bg-[var(--primary-light)]">
                                <Settings size={16} /> Account Settings
                            </button>

                            <button onClick={handleLogout} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem', borderRadius: 'var(--radius-md)',
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#ef4444', textAlign: 'left', fontSize: '0.9rem'
                            }}>
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {showMobileMenu && (
                <div ref={mobileMenuRef} style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    background: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '1rem',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 45,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <Link to="/dashboard" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/dashboard' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/dashboard' ? 'var(--primary-light)' : 'transparent' }}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link to="/history" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/history' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/history' ? 'var(--primary-light)' : 'transparent' }}>
                        <History size={20} /> History
                    </Link>
                    <Link to="/analytics" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/analytics' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/analytics' ? 'var(--primary-light)' : 'transparent' }}>
                        <PieChart size={20} /> Analytics
                    </Link>
                    <Link to="/ai-analysis" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/ai-analysis' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/ai-analysis' ? 'var(--primary-light)' : 'transparent' }}>
                        <Crown size={20} /> AI Analysis
                    </Link>
                    <Link to="/subscriptions" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/subscriptions' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/subscriptions' ? 'var(--primary-light)' : 'transparent' }}>
                        <CreditCard size={20} /> Subscriptions
                    </Link>
                    <Link to="/data-portability" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/data-portability' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/data-portability' ? 'var(--primary-light)' : 'transparent' }}>
                        <Database size={20} /> Data Portability
                    </Link>
                    <Link to="/settings" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: location.pathname === '/settings' ? 'var(--primary-color)' : 'var(--text-secondary)', background: location.pathname === '/settings' ? 'var(--primary-light)' : 'transparent' }}>
                        <Settings size={20} /> Settings
                    </Link>

                    {!user?.isPremium && (
                        <button
                            onClick={() => {
                                setShowMobileMenu(false);
                                setShowSubscriptionModal(true);
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: 600,
                                marginTop: '0.5rem'
                            }}
                        >
                            <Crown size={18} /> Upgrade Premium
                        </button>
                    )}
                </div>
            )}
            {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}
        </div>
    );
};

export default TopBar;
