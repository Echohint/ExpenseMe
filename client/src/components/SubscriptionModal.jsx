import { useState } from 'react';
import { X, Check, Star, Shield, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const plans = [
    { id: 'monthly', name: 'Monthly', price: 99, duration: '1 Month', popular: false },
    { id: 'quarterly', name: 'Quarterly', price: 249, duration: '3 Months', popular: true },
    { id: 'semiannual', name: 'Semi-Annual', price: 499, duration: '6 Months', popular: false },
    { id: 'yearly', name: 'Yearly', price: 899, duration: '1 Year', popular: false },
];

const SubscriptionModal = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth(); // We might need to refresh user data

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubscribe = async (planId) => {
        setLoading(true);
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Order
            const { data: order } = await axios.post('/api/payment/order', { planId });

            // 2. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SHkDlNv7vB7Hyq', // Fallback for dev
                amount: order.amount,
                currency: order.currency,
                name: 'ExpenseMe Premium',
                description: `Subscription for ${planId} plan`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post('/api/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planId
                        });

                        if (verifyRes.data.success) {
                            // alert('Subscription Activated!');
                            window.location.reload(); // Simple reload to refresh user state/context
                            onClose();
                        }
                    } catch (err) {
                        console.error('Verification Error', err);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: ''
                },
                theme: {
                    color: '#3b82f6'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('Payment Error', err);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '900px',
                padding: '0',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'rgba(0,0,0,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        zIndex: 10
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{ padding: '2.5rem', textAlign: 'center', background: 'linear-gradient(to bottom right, var(--primary-light), var(--bg-card))' }}>
                    <div style={{ display: 'inline-flex', padding: '0.75rem', background: '#eab308', borderRadius: '50%', color: 'white', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(234, 179, 8, 0.3)' }}>
                        <Star size={32} fill="white" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Upgrade to Premium</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Unlock advanced features like data export, unlimited history, and detailed analytics.
                    </p>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {plans.map((plan) => (
                            <div key={plan.id} style={{
                                border: plan.popular ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                position: 'relative',
                                background: 'var(--bg-body)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                            }}>
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'var(--primary-color)',
                                        color: 'white',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                                    }}>
                                        MOST POPULAR
                                    </div>
                                )}
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
                                <div style={{ marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>₹{plan.price}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}> / {plan.duration}</span>
                                </div>

                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', flex: 1 }}>
                                    <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <Check size={16} color="var(--success-text)" /> Data Export (CSV/JSON)
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <Check size={16} color="var(--success-text)" /> Priority Support
                                    </li>
                                    <li style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                        <Check size={16} color="var(--success-text)" /> Advanced Analytics
                                    </li>
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: plan.popular ? 'var(--primary-color)' : 'var(--bg-card)',
                                        color: plan.popular ? 'white' : 'var(--text-primary)',
                                        border: plan.popular ? 'none' : '1px solid var(--border-color)',
                                        fontWeight: 600,
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        boxShadow: plan.popular ? '0 4px 6px -1px rgba(37, 99, 235, 0.2)' : 'none'
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Choose Plan'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Shield size={14} /> Secure Payment</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Zap size={14} /> Instant Activation</span>
                        </div>
                        <p>Payments are processed securely via Razorpay. Cancel anytime.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
