import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useExpenses } from '../context/ExpenseContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Analytics = () => {
    const { analytics } = useExpenses();

    if (!analytics) return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Analytics" />
                <div style={{ marginTop: '2rem' }}>Loading...</div>
            </div>
        </div>
    );

    const doughnutData = {
        labels: analytics.categoryBreakdown.map(c => c._id),
        datasets: [
            {
                data: analytics.categoryBreakdown.map(c => c.total),
                backgroundColor: [
                    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'
                ],
                borderWidth: 0,
                hole: 0.5
            },
        ],
    };

    const lineData = {
        labels: analytics.monthlyTrend.map(m => `${m._id.month}/${m._id.year}`),
        datasets: [
            {
                label: 'Monthly Spending',
                data: analytics.monthlyTrend.map(m => m.total),
                borderColor: '#10b981',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#10b981'
            },
        ],
    };

    const maxCategoryTotal = Math.max(...analytics.categoryBreakdown.map(c => c.total), 1);

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Analytics" />

                <div className="grid grid-cols-2 gap-6" style={{ marginTop: '2rem' }}>
                    {/* Spending Breakdown */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Spending Breakdown</h3>
                        <div style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Doughnut
                                data={doughnutData}
                                options={{
                                    cutout: '70%',
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } }
                                }}
                            />
                            <div style={{ position: 'absolute', textAlign: 'center' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>TOTAL</span>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    ₹{analytics.categoryBreakdown.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-4 flex-wrap">
                            {analytics.categoryBreakdown.map((cat, idx) => (
                                <div key={idx} className="flex items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: doughnutData.datasets[0].backgroundColor[idx] }}></div>
                                    <span style={{ color: 'var(--text-secondary)' }}>{cat._id} ({Math.round(cat.total / analytics.categoryBreakdown.reduce((a, c) => a + c.total, 0) * 100)}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Spending Categories */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 style={{ fontSize: '1.1rem' }}>Top Spending Categories</h3>
                            <button style={{ color: 'var(--primary-color)', background: 'none', border: 'none', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>View Full Report →</button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {analytics.categoryBreakdown.slice(0, 4).map((cat, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 600 }}>
                                                {cat._id[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{cat._id}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.count} Transactions</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: 600 }}>₹{cat.total.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{Math.round(cat.total / analytics.categoryBreakdown.reduce((a, c) => a + c.total, 0) * 100)}% of total</div>
                                        </div>
                                    </div>
                                    {/* Progress Bar */}
                                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-body)', borderRadius: '999px', overflow: 'hidden' }}>
                                        <div style={{ width: `${(cat.total / maxCategoryTotal) * 100}%`, height: '100%', background: doughnutData.datasets[0].backgroundColor[idx], borderRadius: '999px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Monthly Spending Trend */}
                    <div className="card col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 style={{ fontSize: '1.1rem' }}>Monthly Spending Trend</h3>
                            <div className="flex gap-4">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                                    Total Spent
                                </span>
                            </div>
                        </div>
                        <div style={{ height: '300px' }}>
                            <Line
                                data={lineData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
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
            </div>
        </div>
    );
};

export default Analytics;
