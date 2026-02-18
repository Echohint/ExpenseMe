import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();

    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <TopBar title="Settings" />

                <div style={{ marginTop: '2rem', maxWidth: '800px' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Personal Information</h3>

                        <div className="flex items-center gap-4 mb-6">
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#f97316' }}>
                                {user?.name?.[0] || 'U'}
                            </div>
                            <div>
                                <h4 style={{ marginBottom: '0.25rem' }}>Profile Photo</h4>
                                <p style={{ fontSize: '0.875rem' }}>This will be displayed on your profile.</p>
                            </div>
                        </div>

                        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="input-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="text" className="form-control" style={{ paddingLeft: '2.5rem' }} defaultValue={user?.name} readOnly />
                                </div>
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label className="input-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input type="email" className="form-control" style={{ paddingLeft: '2.5rem' }} defaultValue={user?.email} readOnly />
                                </div>
                            </div>

                            <div style={{ gridColumn: '1 / -1', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '1rem' }}>
                                <button className="btn btn-primary">Save Changes</button>
                                <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                                    Note: This is a demo. Profile updates are not persisted in this version.
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="card" style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Security</h3>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 style={{ fontSize: '0.95rem' }}>Change Password</h4>
                                <p style={{ fontSize: '0.875rem' }}>Last changed 3 months ago</p>
                            </div>
                            <button className="btn" style={{ border: '1px solid var(--border-color)' }}>Update Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
