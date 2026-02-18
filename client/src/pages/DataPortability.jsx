import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useState, useEffect } from 'react';
import { Download, Upload, FileText, Database, CheckCircle, AlertCircle, FileSpreadsheet, Lock } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import SubscriptionModal from '../components/SubscriptionModal';

const DataPortability = () => {
    const { user } = useAuth();
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSubscription, setShowSubscription] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchActivity();
    }, []);

    const fetchActivity = async () => {
        try {
            const res = await axios.get('/api/data/activity');
            setActivity(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching activity:', err);
            setLoading(false);
        }
    };

    const handleExport = async (formatType) => {
        if (!user?.isPremium) {
            setShowSubscription(true);
            return;
        }

        try {
            const response = await axios.get(`/api/data/export?format=${formatType}`, {
                responseType: 'blob', // Important for file handling
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const ext = formatType === 'json' ? 'json' : 'csv';
            link.setAttribute('download', `expenses_export.${ext}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            // Refresh activity log
            fetchActivity();
            setMessage({ type: 'success', text: 'Export successful!' });
        } catch (err) {
            console.error('Export failed:', err);
            setMessage({ type: 'error', text: 'Export failed. Please try again.' });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage(null);

        try {
            const res = await axios.post('/api/data/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage({ type: 'success', text: res.data.msg });
            fetchActivity();
        } catch (err) {
            console.error('Import failed:', err);
            setMessage({ type: 'error', text: err.response?.data?.msg || 'Import failed.' });
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Data Portability" />

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Manage your financial data. Export your transaction history for external analysis or import past records.
                    </p>

                    {message && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '8px',
                            background: message.type === 'success' ? '#dcfce7' : '#fee2e2',
                            color: message.type === 'success' ? '#166534' : '#991b1b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div style={{ marginBottom: '2rem' }}>
                        {/* Export Section */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: '#3b82f6' }}>
                                    <Download size={24} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem' }}>Export Data</h3>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                Download your transaction history in your preferred format.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleExport('csv')} className="export-btn" style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px',
                                    background: 'var(--bg-body)', cursor: 'pointer', transition: 'all 0.2s',
                                    color: 'var(--text-primary)', position: 'relative'
                                }}>
                                    {!user?.isPremium && <Lock size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-muted)' }} />}
                                    <FileSpreadsheet size={24} color="#10b981" />
                                    <span style={{ fontWeight: 500 }}>CSV</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Spreadsheets</span>
                                </button>
                                <button onClick={() => handleExport('json')} className="export-btn" style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                    padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '12px',
                                    background: 'var(--bg-body)', cursor: 'pointer', transition: 'all 0.2s',
                                    color: 'var(--text-primary)', position: 'relative'
                                }}>
                                    {!user?.isPremium && <Lock size={16} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-muted)' }} />}
                                    <Database size={24} color="#f59e0b" />
                                    <span style={{ fontWeight: 500 }}>JSON</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Raw Data</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Recent Data Activity</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>TYPE</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>DATE & TIME</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500 }}>STATUS</th>
                                        <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>DETAILS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading activity...</td></tr>
                                    ) : activity.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No recent activity</td></tr>
                                    ) : (
                                        activity.map((item) => (
                                            <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '1rem 0', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {item.type.includes('Export') ? <Download size={16} color="#3b82f6" /> : <Upload size={16} color="#8b5cf6" />}
                                                    {item.type}
                                                </td>
                                                <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {format(new Date(item.date), 'MMM dd, yyyy, hh:mm a')}
                                                </td>
                                                <td style={{ padding: '1rem 0' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 500,
                                                        background: item.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                                                        color: item.status === 'Completed' ? '#166534' : '#991b1b'
                                                    }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1rem 0', textAlign: 'right', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                    {item.details}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showSubscription && <SubscriptionModal onClose={() => setShowSubscription(false)} />}
        </div>
    );
};

export default DataPortability;
