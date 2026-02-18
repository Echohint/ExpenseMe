import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import axios from 'axios';
import { Plus, Trash2, Calendar, CreditCard, ExternalLink, X } from 'lucide-react';
import { format } from 'date-fns';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        billingCycle: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        category: 'Entertainment'
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await axios.get('/api/subscriptions');
            setSubscriptions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/subscriptions', formData);
            setSubscriptions([...subscriptions, res.data]);
            setShowAddModal(false);
            setFormData({
                name: '',
                amount: '',
                billingCycle: 'Monthly',
                startDate: new Date().toISOString().split('T')[0],
                category: 'Entertainment'
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this subscription?')) {
            try {
                await axios.delete(`/api/subscriptions/${id}`);
                setSubscriptions(subscriptions.filter(sub => sub._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
        if (sub.billingCycle === 'Monthly') return acc + sub.amount;
        if (sub.billingCycle === 'Quarterly') return acc + (sub.amount / 3);
        if (sub.billingCycle === 'Yearly') return acc + (sub.amount / 12);
        return acc;
    }, 0);

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Subscriptions" />

                <div style={{ padding: '2rem' }}>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Active Subscriptions</h2>
                            <p style={{ color: 'var(--text-secondary)' }}>manage your recurring expenses</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={20} /> Add New
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', border: 'none' }}>
                            <div style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Total Monthly Cost</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700 }}>₹{Math.round(totalMonthlyCost).toLocaleString()}</div>
                        </div>
                        <div className="card">
                            <div style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Active Subscriptions</div>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{subscriptions.length}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {subscriptions.map(sub => (
                            <div key={sub._id} className="card" style={{ position: 'relative' }}>
                                <button
                                    onClick={() => handleDelete(sub._id)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: 'var(--bg-body)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: 'var(--primary-color)'
                                    }}>
                                        {sub.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{sub.name}</h3>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{sub.category}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{sub.amount}</span>
                                    <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', background: 'var(--bg-body)', borderRadius: '999px', color: 'var(--text-secondary)' }}>
                                        {sub.billingCycle}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={16} /> Next Payment
                                    </div>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                                        {format(new Date(sub.nextPaymentDate), 'MMM dd, yyyy')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add Modal */}
                {showAddModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
                        padding: '1rem'
                    }} onClick={() => setShowAddModal(false)}>
                        <div className="card" style={{
                            width: '100%', maxWidth: '500px',
                            background: 'var(--bg-card)',
                            boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--border-color)',
                            animation: 'slideUp 0.3s ease-out'
                        }} onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Add Subscription</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAdd}>
                                <div className="form-group mb-4">
                                    <label className="input-label">Service Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Netflix, Spotify"
                                        style={{ background: 'var(--bg-body)' }}
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="input-label">Amount (₹)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>₹</span>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required
                                            value={formData.amount}
                                            onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                            style={{ paddingLeft: '2.5rem', background: 'var(--bg-body)' }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="form-group">
                                        <label className="input-label">Billing Cycle</label>
                                        <select
                                            className="form-control"
                                            value={formData.billingCycle}
                                            onChange={e => setFormData({ ...formData, billingCycle: e.target.value })}
                                            style={{ background: 'var(--bg-body)' }}
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Quarterly">Quarterly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="input-label">Category</label>
                                        <select
                                            className="form-control"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            style={{ background: 'var(--bg-body)' }}
                                        >
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Software">Software</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group mb-6">
                                    <label className="input-label">First Payment Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        required
                                        value={formData.startDate}
                                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        style={{ background: 'var(--bg-body)' }}
                                    />
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => setShowAddModal(false)}
                                        style={{ background: 'transparent', color: 'var(--text-secondary)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ padding: '0.75rem 2rem' }}
                                    >
                                        Add Subscription
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Subscriptions;
