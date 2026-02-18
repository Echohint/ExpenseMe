import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler } from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Lock, Crown } from 'lucide-react';
import SubscriptionModal from '../components/SubscriptionModal';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Filler);

const AiAnalysis = () => {
    const { analytics } = useExpenses();
    const { user } = useAuth();
    const [showSubscription, setShowSubscription] = useState(false);

    if (!analytics) return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="AI Analysis" />
                <div style={{ marginTop: '2rem' }}>Loading...</div>
            </div>
        </div>
    );

    const barData = {
        labels: analytics.categoryBreakdown.map(c => c._id),
        datasets: [
            {
                label: 'Category Spending',
                data: analytics.categoryBreakdown.map(c => c.total),
                backgroundColor: '#3b82f6',
                borderRadius: 4,
            }
        ]
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="AI Analysis" />

                {!user?.isPremium ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '70vh',
                        textAlign: 'center',
                        gap: '1.5rem',
                        padding: '2rem'
                    }}>
                        <div style={{
                            background: 'var(--bg-card)',
                            padding: '3rem',
                            borderRadius: '24px',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-color)',
                            maxWidth: '500px',
                            width: '100%'
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem auto',
                                boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)'
                            }}>
                                <Crown size={32} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Premium Feature</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                                Upgrade to ExpenseMe Premium to unlock advanced AI-powered analytics, bar graphs, and detailed insights into your spending habits.
                            </p>
                            <button
                                onClick={() => setShowSubscription(true)}
                                style={{
                                    background: 'var(--primary-color)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto',
                                    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                <Lock size={18} /> Unlock AI Analysis
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6" style={{ marginTop: '2rem' }}>
                        {/* Premium Content: Bar Graph */}
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Premium: Category Spending Analysis</h3>
                            <div style={{ height: '400px' }}>
                                <Bar
                                    data={barData}
                                    options={{
                                        maintainAspectRatio: false,
                                        scales: {
                                            y: {
                                                beginAtZero: true,
                                                grid: { color: 'var(--border-color)', borderDash: [5, 5] },
                                                ticks: { callback: (value) => '₹' + value / 1000 + 'k' }
                                            },
                                            x: {
                                                grid: { display: false }
                                            }
                                        },
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showSubscription && <SubscriptionModal onClose={() => setShowSubscription(false)} />}
        </div>
    );
};

export default AiAnalysis;
